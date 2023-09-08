import cookie from '@elysiajs/cookie';
import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { auth, isAuthed } from '@/auth/lucia';
import { db } from '@/db';
import { users } from '@/db/schema';
import { env } from '@/env';

export const authRoutes = new Elysia().group(
  '/auth',
  app =>
    app
      .use(
        cookie({
          secret: env.COOKIE_SECRET
        })
      )
      .model(
        'auth',
        t.Object({
          username: t.String(),
          password: t.String({
            minLength: 8
          })
        })
      )
      .post(
        '/sign-up',
        async ({ body: { username, password } }) => {
          const user = await auth.createUser({
            key: {
              providerId: 'username',
              providerUserId: username,
              password
            },
            attributes: {
              email: null,
              name: null,
              last_name: null,
              username
            }
          });

          return user;
        },
        {
          body: 'auth'
        }
      )
      .post(
        '/sign-in',
        async ({ setCookie, body: { username, password } }) => {
          const { userId } = await auth.useKey('username', username, password);

          const session = await auth.createSession({
            userId,
            attributes: {}
          });
          setCookie('session', session.sessionId);

          return `Signed in as ${username}`;
        },
        {
          body: 'auth'
        }
      )
      .get(
        '/profile',
        async ({ set, cookie: { session } }) => {
          const userSession = await auth.getSession(session);

          const user = await db.query.users.findFirst({
            where: eq(users.id, userSession.user.userId)
          });

          if (!user) {
            set.status = 404;
            return `User not found`;
          }

          return user;
        },
        {
          beforeHandle: isAuthed
        }
      )
      .get(
        '/sign-out',
        async ({ cookie: { session }, unsignCookie, set }) => {
          await auth.invalidateSession(session);

          unsignCookie('session');

          set.status = 200;
        },
        {
          beforeHandle: isAuthed
        }
      )
  // .delete(
  //   '/user',
  //   async ({ cookie: { session } }) => {
  //     const { userId: id } = await auth.getSession(session);

  //     await auth.deleteDeadUserSessions(session);
  //     await auth.deleteUser(id);

  //     return id;
  //   },
  //   {
  //     beforeHandle: sessionGuard
  //   }
  // )
);
