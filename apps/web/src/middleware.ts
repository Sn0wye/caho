import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // TODO: remove new-login from public routes
  publicRoutes: ['/', '/api/(.*)', '/new-login']
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
