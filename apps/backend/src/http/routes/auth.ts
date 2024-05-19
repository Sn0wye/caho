import type { App } from '@/app';
import { getProfileController } from '../controllers/auth/get-profile';
import { signInController } from '../controllers/auth/sign-in';
import { signOutController } from '../controllers/auth/sign-out';
import { signUpController } from '../controllers/auth/sign-up';

export const authRoutes = async (app: App) => {
  app.register(signUpController);
  app.register(signInController);
  app.register(getProfileController);
  app.register(signOutController);

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
