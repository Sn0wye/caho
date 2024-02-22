import { z } from 'zod';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';

export const signOutController = async (app: App) => {
  app.post(
    '/sign-out',
    {
      schema: {
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
