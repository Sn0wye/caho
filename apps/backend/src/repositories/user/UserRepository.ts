import type { UserSchema } from '@caho/schemas';
import type { IUserRepository } from './IUserRepository';
import { db } from '@/db';

export class UserRepository implements IUserRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async findByUsername(username: string): Promise<UserSchema | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username)
    });

    return user ? user : null;
  }
}
