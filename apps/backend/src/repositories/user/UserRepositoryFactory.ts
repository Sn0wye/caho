import type { IUserRepository } from './IUserRepository';
import { UserRepository } from './UserRepository';

export function UserRepositoryFactory(): IUserRepository {
  return new UserRepository();
}
