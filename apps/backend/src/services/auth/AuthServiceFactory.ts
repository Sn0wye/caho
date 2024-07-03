import { UserRepository } from '@/repositories/user';
import { AuthService } from './AuthService';

export function AuthServiceFactory(): AuthService {
  return new AuthService(new UserRepository());
}
