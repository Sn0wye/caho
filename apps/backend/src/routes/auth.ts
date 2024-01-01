import { Type } from '@sinclair/typebox';
import { type App } from '@/app';
import { auth, githubAuth } from '../auth/lucia';

const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String({
    minLength: 8
  })
});

export const authRoutes = async (app: App) => {
  app.post(
    '/sign-up',
    {
      schema: {
        body: AuthBody
      }
    },
    async (req, res) => {
      const authRequest = auth.handleRequest(req, res);
      const { username, password } = req.body;
      const { userId } = await auth.createUser({
        key: {
          providerId: 'username',
          providerUserId: username,
          password
        },
        attributes: {
          email: null,
          name: null,
          avatar_url: null,
          username
        }
      });

      const session = await auth.createSession({
        userId,
        attributes: {}
      });

      authRequest.setSession(session);

      const user = await app.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.userId)
      });

      return user;
    }
  );

  app.post(
    '/sign-in',
    {
      schema: {
        body: AuthBody
      }
    },
    async (req, res) => {
      const authRequest = auth.handleRequest(req, res);
      const { username, password } = req.body;
      try {
        const { userId } = await auth.useKey('username', username, password);

        const session = await auth.createSession({
          userId,
          attributes: {}
        });

        authRequest.setSession(session);
        auth.createSessionCookie(session);

        const user = await app.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, session.user.userId)
        });

        if (user) {
          return user;
        }
      } catch (e) {
        res.unauthorized('Usuário ou senha inválidos');
      }
    }
  );

  app.get('/profile', async (req, res) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    if (!session) {
      return res.unauthorized();
    }

    const user = await app.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.userId)
    });

    return user;
  });

  app.post('/sign-out', async (req, res) => {
    try {
      const authRequest = auth.handleRequest(req, res);
      const cookie = req.cookies['auth_session'];

      if (cookie) {
        const { sessionId } = await auth.getSession(cookie);
        await auth.invalidateSession(sessionId);
        authRequest.setSession(null);
      }

      return `Signed out`;
    } catch (e) {
      // if (e instanceof LuciaError && e.message === 'AUTH_INVALID_SESSION_ID') {
      //   return res.unauthorized();
      // }
      // return res.unauthorized();
      return `Signed out`;
    }
  });

  app.get('/github', async (req, res) => {
    const [url, state] = await githubAuth.getAuthorizationUrl();
    res.setCookie('github_oauth_state', state, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60
    });
    res.redirect(url.toString());
  });

  app.get('/github/callback', async (req, res) => {
    const query = req.query as { code?: string; state?: string };
    const code = query.code ?? null;
    const state = query.state ?? null;
    const storedState = req.cookies['github_oauth_state'];

    if (!state || !storedState || state !== storedState) {
      return res.unauthorized();
    }

    if (!code) {
      return res.badRequest();
    }

    try {
      const user = await validateCallbackAndGetUser(code);
      console.log('user created', user);
      const session = await auth.createSession({
        userId: user.id,
        attributes: {}
      });
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);
      auth.createSessionCookie(session);
      res.unsignCookie(storedState);
      res.redirect('http://localhost:3000');
    } catch (e) {
      console.log('error', e);
      return res.unauthorized();
    }
  });
};

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
      username: githubUser.login,
      avatar_url: githubUser.avatar_url
    }
  });
};
