import { signUpRequest, signUpResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';
import { hash } from '@/utils/password';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';
import { users } from '@/db/schema';

export const signUpController = async (app: App) => {
  app.post(
    '/sign-up',
    {
      schema: {
        body: signUpRequest,
        response: {
          200: signUpResponse,
          401: errorSchema
        }
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
};
