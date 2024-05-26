import type { App } from '@/app';
import { auth, googleAuth } from '@/auth/lucia';
import { db } from '@/db';
import { oauthAccounts, users } from '@/db/schema';
import { env } from '@/env';
import { BadRequestError, InternalServerError } from '@/errors';
import { createId } from '@paralleldrive/cuid2';
import {
  OAuth2RequestError,
  generateCodeVerifier,
  generateState
} from 'arctic';
import { z } from 'zod';

type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

export const signInWithGoogle = async (app: App) => {
  app.get('/google', async (req, res) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
      scopes: ['profile', 'email']
    });

    res.setCookie('state', state, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10 // 10 min
    });

    res.setCookie('code_verifier', codeVerifier, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10 // 10 min
    });

    return res.redirect(url.toString());
  });

  app.get(
    '/google/callback',
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
      const storedState = req.cookies.state ?? null;
      const storedCodeVerifier = req.cookies.code_verifier ?? null;

      if (
        !code ||
        !storedState ||
        !storedCodeVerifier ||
        state !== storedState
      ) {
        console.log({
          code: !code,
          storedState: !storedState,
          storedCodeVerifier: !storedCodeVerifier,
          state: state !== storedState
        });

        throw new BadRequestError('Invalid state');
      }

      try {
        const tokens = await googleAuth.validateAuthorizationCode(
          code,
          storedCodeVerifier
        );

        const response = await fetch(
          'https://openidconnect.googleapis.com/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new InternalServerError('Failed to fetch Google user');
        }

        const googleUser: GoogleUser = await response.json();

        const existingAccount = await db.query.oauthAccounts
          .findFirst({
            where: (account, { and, eq }) =>
              and(
                eq(account.providerId, 'google'),
                eq(account.providerUserId, googleUser.sub)
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
          where: (user, { eq }) => eq(user.email, googleUser.email)
        });

        const userId = userExists?.id ?? createId();

        await db.transaction(async tx => {
          if (!userExists) {
            await tx
              .insert(users)
              .values({
                id: userId,
                name: googleUser.name,
                email: googleUser.email,
                avatarUrl: googleUser.picture,
                username: '',
                password: ''
              })
              .execute();
          }

          await tx
            .insert(oauthAccounts)
            .values({
              providerId: 'google',
              providerUserId: googleUser.sub,
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

        console.log('THROWN', e);

        throw new InternalServerError('Failed to sign in with Google');
      }
    }
  );
};
