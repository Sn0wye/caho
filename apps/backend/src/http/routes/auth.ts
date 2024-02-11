import { Type } from '@sinclair/typebox';
import { hash, verify } from '@/utils/password';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';
import { users } from '@/db/schema';

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
      const { username, password } = req.body;

      const userExists = await app.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username)
      });

      if (userExists) {
        return res.unauthorized();
      }

      const hashedPassword = await hash(password);

      await app.db
        .insert(users)
        .values({
          username,
          password: hashedPassword
        })
        .execute();

      const user = await app.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
        columns: {
          id: true,
          username: true,
          email: true,
          name: true,
          avatarUrl: true
        }
      });

      if (!user) {
        return res.unauthorized();
      }

      const session = await auth.createSession(user.id, {});

      const sessionCookie = auth.createSessionCookie(session.id);
      res.setCookie(sessionCookie.name, sessionCookie.value);

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
      if (req.session) {
        return req.user;
      }

      const { username, password } = req.body;

      try {
        const user = await app.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.username, username)
        });

        if (!user) {
          return res.unauthorized('Usuário ou senha inválidos');
        }

        const passwordsMatch = await verify(user.password, password);

        if (!passwordsMatch) {
          res.unauthorized('Usuário ou senha inválidos');
        }

        const session = await auth.createSession(user.id, {});

        const cookie = auth.createSessionCookie(session.id);
        res.setCookie(cookie.name, cookie.value, cookie.attributes);

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl
        };
      } catch (e) {
        res.unauthorized('Usuário ou senha inválidos');
      }
    }
  );

  app.get('/profile', (req, res) => {
    if (!req.session || !req.user) {
      return res.unauthorized();
    }

    return req.user;
  });

  app.post('/sign-out', async (req, res) => {
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
  });

  // app.get('/github', async (req, res) => {
  //   const [url, state] = await githubAuth.getAuthorizationUrl();
  //   res.setCookie('github_oauth_state', state, {
  //     path: '/',
  //     httpOnly: true,
  //     maxAge: 60 * 60
  //   });
  //   res.redirect(url.toString());
  // });

  // app.get('/github/callback', async (req, res) => {
  //   const query = req.query as { code?: string; state?: string };
  //   const code = query.code ?? null;
  //   const state = query.state ?? null;
  //   const storedState = req.cookies['github_oauth_state'];

  //   if (!state || !storedState || state !== storedState) {
  //     return res.unauthorized();
  //   }

  //   if (!code) {
  //     return res.badRequest();
  //   }

  //   try {
  //     const user = await validateCallbackAndGetUser(code);
  //     console.log('user created', user);
  //     const session = await auth.createSession({
  //       userId: user.id,
  //       attributes: {}
  //     });
  //     const authRequest = auth.handleRequest(req, res);
  //     authRequest.setSession(session);
  //     auth.createSessionCookie(session);
  //     res.unsignCookie(storedState);
  //     res.redirect('http://localhost:3000');
  //   } catch (e) {
  //     console.log('error', e);
  //     return res.unauthorized();
  //   }
  // });
};

// const validateCallbackAndGetUser = async (code: string) => {
//   const { githubUser, getExistingUser, createUser } =
//     await githubAuth.validateCallback(code);
//   const existingUser = await getExistingUser();

//   if (existingUser) return existingUser;

//   // create a new user if the user does not exist
//   return await createUser({
//     attributes: {
//       email: githubUser.email,
//       name: githubUser.name,
//       username: githubUser.login,
//       avatar_url: githubUser.avatar_url
//     }
//   });
// };
