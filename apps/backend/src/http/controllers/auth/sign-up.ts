import type { App } from '@/app';
import { auth } from '@/auth/lucia';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hash } from '@/utils/password';
import { signUpRequest, signUpResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';

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

      const userExists = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username)
      });

      if (userExists) {
        return res.unauthorized();
      }

      const hashedPassword = await hash(password);

      const dbUser = (
        await db
          .insert(users)
          .values({
            username,
            password: hashedPassword,
            avatarUrl: null,
            email: null,
            name: null
          })
          .returning()
      )[0];

      const user = {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl
      };

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
