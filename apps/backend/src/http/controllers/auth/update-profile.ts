import type { App } from '@/app';
import { db } from '@/db';
import { users } from '@/db/schema';
import { BadRequestError } from '@/errors';
import { ensureAuth } from '@/plugins/ensure-auth';
import { updateProfileRequest, updateProfileResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';
import { eq } from 'drizzle-orm';

export const updateProfileController = async (app: App) => {
  app.register(ensureAuth).post(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Update user profile',
        security: [{ cookieAuth: [], bearerAuth: [] }],
        body: updateProfileRequest,
        response: {
          200: updateProfileResponse,
          400: errorSchema,
          401: errorSchema,
          422: errorSchema
        }
      }
    },
    async req => {
      const user = req.getUser();

      const { username, email, avatarUrl } = req.body;

      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) =>
          or(eq(users.username, username), eq(users.email, email))
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestError('Username or email already taken');
      }

      const updatedUser = (
        await db
          .update(users)
          .set({ email, avatarUrl, username })
          .where(eq(users.id, user.id))
          .returning({
            id: users.id,
            name: users.name,
            username: users.username,
            email: users.email,
            avatarUrl: users.avatarUrl
          })
      )[0];

      return updatedUser;
    }
  );
};
