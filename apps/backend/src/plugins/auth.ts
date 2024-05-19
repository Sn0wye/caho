import { fastifyPlugin } from 'fastify-plugin';
import type { Session, User } from 'lucia';
import type { App } from '@/app';
import { auth } from '@/auth/lucia';

export const authPlugin = fastifyPlugin(
  async (app: App) => {
    app.addHook('preHandler', async (req, res) => {
      const sessionId = auth.readSessionCookie(req.headers.cookie ?? '');

      if (!sessionId) {
        req.user = null;
        req.session = null;
        return;
      }

      const { session, user } = await auth.validateSession(sessionId);
      if (session?.fresh) {
        const cookie = auth.createSessionCookie(session.id);
        res.setCookie(cookie.name, cookie.value, cookie.attributes);
      }

      if (!session) {
        const cookie = auth.createBlankSessionCookie();
        res.setCookie(cookie.name, cookie.value, cookie.attributes);
      }

      req.user = user;
      req.session = session;
      return;
    });
  },
  {
    name: 'auth',
    fastify: '4.x'
  }
);

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
}
