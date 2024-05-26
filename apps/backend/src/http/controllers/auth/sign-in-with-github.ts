import { OAuth2RequestError, generateState } from 'arctic';
import { auth, githubAuth } from '@/auth/lucia';
import { z } from 'zod';
import type { App } from '@/app';
import { BadRequestError, InternalServerError } from '@/errors';
import { db } from '@/db';
import { oauthAccounts, users } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { env } from '@/env';

export const signInWithGithub = async (app: App) => {
  app.get('/github', async (req, res) => {
    const state = generateState();
    const url = await githubAuth.createAuthorizationURL(state);

    res.setCookie('github_oauth_state', state, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax'
    });

    return res.redirect(url.toString());
  });

  app.get(
    '/github/callback',
    {
      schema: {
        querystring: z.object({
          code: z.string(),
          state: z.string()
        })
      }
    },
    async (req, res) => {
      const { code, state } = req.query;

      const storedState = req.cookies.github_oauth_state ?? null;

      if (!code || !state || !storedState || state !== storedState) {
        throw new BadRequestError('Invalid state');
      }

      try {
        const tokens = await githubAuth.validateAuthorizationCode(code);
        const githubUserResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        });
        const githubUser: GitHubUser = await githubUserResponse.json();

        const existingAccount = await db.query.oauthAccounts
          .findFirst({
            where: (account, { and, eq }) =>
              and(
                eq(account.providerId, 'github'),
                eq(account.providerUserId, githubUser.id)
              )
          })
          .execute();

        if (existingAccount) {
          const session = await auth.createSession(existingAccount.userId, {});
          const sessionCookie = auth.createSessionCookie(session.id);

          res.setCookie(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );

          return res.status(302).redirect(env.FRONTEND_AUTH_REDIRECT_URL);
        }

        const userExists = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.username, githubUser.login)
        });

        const userId = userExists?.id ?? createId();

        await db.transaction(async tx => {
          if (!userExists) {
            await tx
              .insert(users)
              .values({
                id: userId,
                avatarUrl: githubUser.avatar_url,
                name: githubUser.name,
                username: githubUser.login,
                password: ''
              })
              .execute();
          }

          await tx
            .insert(oauthAccounts)
            .values({
              providerId: 'github',
              providerUserId: githubUser.id,
              userId
            })
            .execute();
        });

        const session = await auth.createSession(userId, {});
        const sessionCookie = auth.createSessionCookie(session.id);
        res.setCookie(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        return res.redirect(env.FRONTEND_AUTH_REDIRECT_URL);
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          throw new BadRequestError('Invalid code');
        }

        throw new InternalServerError('Failed to sign in with GitHub');
      }
    }
  );
};

interface GitHubUser {
  id: string;
  name?: string;
  login: string;
  avatar_url: string;
}
