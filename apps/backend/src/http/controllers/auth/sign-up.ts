import type { App } from '@/app';
import { AuthServiceFactory } from '@/services/auth/AuthServiceFactory';
import { signUpRequest, signUpResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';

export const signUpController = async (app: App) => {
  app.post(
    '/sign-up',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Sign up with username & password',
        body: signUpRequest,
        response: {
          200: signUpResponse,
          401: errorSchema
        }
      }
    },
    async (req, res) => {
      const authService = AuthServiceFactory();

      const { username, password } = req.body;
      const { cookie, user } = await authService.signUp(username, password);

      res.setCookie(cookie.name, cookie.value);

      return {
        ...user,
        token: cookie.value
      };
    }
  );
};
