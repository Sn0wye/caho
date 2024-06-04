import type { App } from '@/app';
import { getProfileController } from '../controllers/auth/get-profile';
import { signInController } from '../controllers/auth/sign-in';
import { signInWithGithub } from '../controllers/auth/sign-in-with-github';
import { signInWithGoogle } from '../controllers/auth/sign-in-with-google';
import { signOutController } from '../controllers/auth/sign-out';
import { signUpController } from '../controllers/auth/sign-up';

export const authRoutes = async (app: App) => {
  app.register(signUpController);
  app.register(signInController);
  app.register(signInWithGithub);
  app.register(signInWithGoogle);
  app.register(getProfileController);
  app.register(signOutController);
};
