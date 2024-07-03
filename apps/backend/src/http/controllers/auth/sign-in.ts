import type { App } from '@/app';
import { AuthServiceFactory } from '@/services/auth/AuthServiceFactory';
import { signInRequest, signInResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';

export const signInController = async (app: App) => {
  app.post(
    '/sign-in',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Sign in with username & password',
        body: signInRequest,
        response: {
          200: signInResponse,
          401: errorSchema
        }
      }
    },
    async (req, res) => {
      const { username, password } = req.body;

      try {
        const authService = AuthServiceFactory();
        const { cookie, user } = await authService.signIn(username, password);

        res.setCookie(cookie.name, cookie.value, cookie.attributes);

        return {
          ...user,
          token: cookie.value
        };
      } catch (e) {
        return res.unauthorized('Usuário ou senha inválidos');
      }
    }
  );
};
