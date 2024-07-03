import type { UserSchema } from '@caho/schemas';

export type IUserRepository = {
  findByUsername(username: string): Promise<UserSchema | null>;
};
