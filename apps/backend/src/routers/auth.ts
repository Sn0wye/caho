import cookie from '@elysiajs/cookie';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { auth, githubAuth, isAuthed } from '@/auth/lucia';
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
            userId: createId(),
            key: {
              providerId: 'username',
              providerUserId: username,
              password
            },
            attributes: {
              email: null,
              name: null,
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

          setCookie('session', session.sessionId, {
            httpOnly: true
          });

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
      .post('/github', async ({ setCookie, set }) => {
        // get url to redirect the user to, with the state
        const [url, state] = await githubAuth.getAuthorizationUrl();

        setCookie('github_oauth_state', state, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60
        });

        set.redirect = String(url);
      })
      .get('/github/callback', async ({ request, cookie, setCookie, set }) => {
        const requestUrl = new URL(request.url);

        const code = requestUrl.searchParams.get('code');
        const state = requestUrl.searchParams.get('state');

        const storedState = cookie['github_oauth_state'];

        if (!state || !storedState || state !== storedState) {
          set.status = 401;
          return `Unauthorized`;
        }

        if (!code) {
          set.status = 400;
          return `Bad Request`;
        }

        try {
          const user = await validateCallbackAndGetUser(code);

          const session = await auth.createSession({
            userId: user.id,
            attributes: {}
          });

          setCookie('session', session.sessionId, {
            httpOnly: true
          });

          set.status = 200;
          return;
        } catch {
          set.status = 401;
          return `Unauthorized`;
        }
      })
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

const validateCallbackAndGetUser = async (code: string) => {
  const { githubUser, getExistingUser, createUser } =
    await githubAuth.validateCallback(code);

  const existingUser = await getExistingUser();
  if (existingUser) return existingUser;
  // create a new user if the user does not exist
  return await createUser({
    userId: createId(),
    attributes: {
      email: githubUser.email,
      name: githubUser.name,
      username: githubUser.login
    }
  });
};
