import type { App } from '@/app';
import { BadRequestError } from '@/errors';
import { AuthServiceFactory } from '@/services/auth/AuthServiceFactory';
import { z } from 'zod';

export const signInWithGithub = async (app: App) => {
  const authService = AuthServiceFactory();

  app.get(
    '/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Sign in with GitHub OAuth'
      }
    },
    async (_, res) => {
      const { url, state } = await authService.signInWithGithub();

      res.setCookie('github_oauth_state', state, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
      });

      return res.redirect(url.toString());
    }
  );

  app.get(
    '/github/callback',
    {
      schema: {
        tags: ['Auth'],
        summary: 'GitHub OAuth Callback',
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

      const { cookie, redirectUrl } = await authService.githubCallback({
        authorizationCode: code
      });

      res.setCookie(cookie.name, cookie.value, cookie.attributes);

      return res.redirect(redirectUrl);
    }
  );
};
