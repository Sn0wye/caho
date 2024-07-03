import type { App } from '@/app';
import { BadRequestError } from '@/errors';
import { AuthServiceFactory } from '@/services/auth/AuthServiceFactory';
import { z } from 'zod';

export const signInWithGoogle = async (app: App) => {
  const authService = AuthServiceFactory();

  app.get('/google', async (_, res) => {
    const { state, codeVerifier, redirectUrl } =
      await authService.signInWithGoogle();

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

    return res.redirect(redirectUrl);
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

      const { cookie, redirectUrl } = await authService.googleCallback({
        authorizationCode: code,
        codeVerifier: storedCodeVerifier
      });

      res.setCookie(cookie.name, cookie.value, cookie.attributes);

      return res.redirect(redirectUrl);
    }
  );
};
