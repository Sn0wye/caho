import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { githubAuth, isAuthed } from '@/auth/lucia';
import { ctx } from '@/context';
import { users } from '@/db/schema';

const authModel = new Elysia().model(
  'auth',
  t.Object({
    username: t.String(),
    password: t.String({
      minLength: 8
    })
  })
);

export const authRoutes = new Elysia({
  prefix: '/auth'
})
  .use(ctx)
  .use(authModel)
  .get('/teste', () => 'teste')
  .post(
    '/sign-up',
    async ({ body: { username, password }, auth }) => {
      const user = await auth.createUser({
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
    async ({ cookie, body: { username, password }, auth }) => {
      const { userId } = await auth.useKey('username', username, password);

      const session = await auth.createSession({
        userId,
        attributes: {}
      });

      cookie.session.set({
        path: '/',
        value: session.sessionId,
        httpOnly: true
      });

      return `Signed in as ${username}`;
    },
    {
      body: 'auth',
      cookie: t.Cookie({
        session: t.String()
      })
    }
  )
  .get(
    '/profile',
    async ({ set, cookie: { session }, db, auth }) => {
      const userSession = await auth.getSession(session.value);

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
      beforeHandle: isAuthed,
      cookie: t.Cookie({
        session: t.String()
      })
    }
  )
  .get(
    '/sign-out',
    async ({ cookie: { session }, set, auth }) => {
      await auth.invalidateSession(session.value);

      session.set({
        value: null
      });

      set.status = 200;
    },
    {
      beforeHandle: isAuthed
    }
  )
  .post(
    '/github',
    async ({ cookie, set }) => {
      // get url to redirect the user to, with the state
      const [url, state] = await githubAuth.getAuthorizationUrl();

      cookie.github_oauth_state.set({
        value: state,
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60
      });

      set.redirect = url.toString();
    },
    {
      cookie: t.Cookie({
        github_oauth_state: t.String()
      })
    }
  )
  .get(
    '/github/callback',
    async ({ request, cookie, set, auth }) => {
      const requestUrl = new URL(request.url);

      const code = requestUrl.searchParams.get('code');
      const state = requestUrl.searchParams.get('state');

      const storedState = cookie['github_oauth_state'].value;

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

        cookie.session.set({
          value: session.sessionId,
          httpOnly: true
        });

        set.status = 200;
        return;
      } catch {
        set.status = 401;
        return `Unauthorized`;
      }
    },
    {
      cookie: t.Cookie({
        github_oauth_state: t.String(),
        session: t.String()
      })
    }
  );
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

const validateCallbackAndGetUser = async (code: string) => {
  const { githubUser, getExistingUser, createUser } =
    await githubAuth.validateCallback(code);

  const existingUser = await getExistingUser();
  if (existingUser) return existingUser;
  // create a new user if the user does not exist
  return await createUser({
    attributes: {
      email: githubUser.email,
      name: githubUser.name,
      username: githubUser.login
    }
  });
};
