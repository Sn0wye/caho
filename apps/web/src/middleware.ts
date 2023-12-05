// import { authMiddleware } from '@clerk/nextjs';
import { NextResponse, type NextRequest } from 'next/server';

// export default authMiddleware({
//   // TODO: remove new-login from public routes
//   publicRoutes: ['/', '/api/(.*)', '/new-login']
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
// };

export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}
