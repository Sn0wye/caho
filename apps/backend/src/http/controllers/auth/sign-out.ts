import type { App } from '@/app';
import { AuthServiceFactory } from '@/services/auth/AuthServiceFactory';
import { z } from 'zod';

export const signOutController = async (app: App) => {
  app.post(
    '/sign-out',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Sign out',
        response: {
          204: z.never()
        }
      }
    },
    async (req, res) => {
      try {
        const authService = AuthServiceFactory();

        const session = req.getSession();

        const cookie = await authService.signOut(session.id);
        res.setCookie(cookie.name, cookie.value, cookie.attributes);

        res.status(204);
        return;
      } catch {
        res.status(204);
        return;
      }
    }
  );
};
