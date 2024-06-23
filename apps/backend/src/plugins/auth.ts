import { auth } from '@/auth/lucia';
import { UnauthorizedError } from '@/errors';
import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import type { Session, User } from 'lucia';

export const authPlugin = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook('preHandler', async (req, res) => {
      const sessionId =
        auth.readSessionCookie(req.headers.cookie ?? '') ??
        auth.readBearerToken(req.headers.authorization ?? '');
      let user: User | null = null;
      let session: Session | null = null;

      if (sessionId) {
        const validatedSession = await auth.validateSession(sessionId);
        if (validatedSession?.session?.fresh) {
          const cookie = auth.createSessionCookie(validatedSession.session.id);
          res.setCookie(cookie.name, cookie.value, cookie.attributes);
        }

        user = validatedSession.user;
        session = validatedSession.session;
      }

      req.getUser = () => {
        if (!user) {
          throw new UnauthorizedError();
        }
        return user;
      };

      req.getSession = () => {
        if (!session) {
          throw new UnauthorizedError();
        }
        return session;
      };

      return;
    });
  },
  { name: 'auth', fastify: '4.x' }
);
