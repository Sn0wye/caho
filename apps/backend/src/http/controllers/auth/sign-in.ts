import { signInRequest, signInResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';
import { verify } from '@/utils/password';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';

export const signInController = async (app: App) => {
  app.post(
    '/sign-in',
    {
      schema: {
        body: signInRequest,
        response: {
          200: signInResponse,
          401: errorSchema
        }
      }
    },
    async (req, res) => {
      if (req.session && req.user) {
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
        return res.unauthorized('Usuário ou senha inválidos');
      }
    }
  );
};
