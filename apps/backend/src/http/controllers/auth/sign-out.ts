import type { App } from '@/app';
import { auth } from '@/auth/lucia';
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
      if (!req.session) {
        res.status(204);
        return;
      }

      const session = req.session;
      await auth.invalidateSession(session.id);
      const cookie = auth.createBlankSessionCookie();

      res.setCookie(cookie.name, cookie.value, cookie.attributes);

      res.status(204);
      return;
    }
  );
};
