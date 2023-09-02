// import { jwt } from '@elysiajs/jwt';

// import { env } from '@/env.js';
// import { cookie } from '@elysiajs/cookie';
// import { db } from './db';
// import { tokens, users } from './db/schema';
// import { createId } from '@paralleldrive/cuid2';
// import { eq } from 'drizzle-orm';
// import { compare } from './utils/password';

// const isAuthenticated = async ({
//   cookie
// }: {
//   cookie: Record<string, string>;
// }) => {
//   if (!cookie.token) {
//   }
// };

import { Redis } from '@upstash/redis';
import { Elysia } from 'elysia';
import { env } from '@/env';

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
});

const setup = (app: Elysia) => app.state('redis', redis);

const app = new Elysia()
  .use(setup)
  .get('/ping', () => 'pong')
  .group('/room', app => app);
// GET /rooms/:roomCode
// GET /rooms/list (list public rooms)
// POST /rooms/create
// POST /rooms/:roomCode/join (send password)
// POST /rooms/start/:roomCode
// POST /rooms/end/:roomCode
// POST /rooms/:roomCode/leave  (send roomCode, playerId)

export type App = typeof app;

// .use(
//   jwt({
//     name: 'jwt',
//     secret: env.JWT_SECRET,
//     exp: env.JWT_EXPIRES_IN,
//     schema: t.Object({
//       name: t.String()
//     })
//   })
// )
// .use(
//   jwt({
//     name: 'refreshJWT',
//     secret: env.JWT_REFRESH_TOKEN_SECRET,
//     exp: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
//     schema: t.Object({
//       name: t.String()
//     })
//   })
// )
// .use(cookie())
// .group('/auth', app =>
//   app
//     .get('/', async ({ jwt, set, cookie: { token } }) => {
//       const decodedToken = await jwt.verify(token);

//       if (!decodedToken) {
//         set.status = 401;
//         return 'Unauthorized';
//       }

//       return decodedToken;
//     })
//     .post(
//       '/sign-in',
//       async ({ jwt, refreshJWT, set, setCookie, body }) => {
//         const user = (
//           await db
//             .select()
//             .from(users)
//             .where(eq(users.name, body.name))
//             .limit(1)
//         )[0];

//         if (!user) {
//           set.status = 404;
//           return 'Password or username is incorrect';
//         }

//         const passwordsMatch = compare(user.password, body.password);

//         if (!passwordsMatch) {
//           set.status = 404;
//           return 'Password or username is incorrect';
//         }

//         const token = await jwt.sign({
//           name: user.name,
//           sub: user.id
//         });

//         setCookie('token', token, {
//           httpOnly: true,
//           maxAge: 7 * 86400 // 7 days
//         });

//         // create refresh token cannot have the name refreshToken
//         const refreshToken = await refreshJWT.sign({
//           sub: user.id,
//           name: user.name
//         });

//         setCookie('refreshToken', refreshToken, {
//           httpOnly: true,
//           maxAge: 30 * 86400 // 30 days
//         });

//         db.insert(tokens)
//           .values({
//             userId: user.id,
//             id: createId(),
//             token: refreshToken
//           })
//           .run();

//         set.status = 200;
//         return {
//           token,
//           refreshToken
//         };
//       },
//       {
//         body: t.Object({
//           name: t.String(),
//           password: t.String()
//         })
//       }
//     )
//     .post(
//       '/refresh',
//       async ({ cookie, refreshJWT, jwt, set }) => {
//         const refreshToken = cookie.refreshToken;

//         const dbToken = (
//           await db
//             .select()
//             .from(tokens)
//             .where(eq(tokens.token, refreshToken))
//             .limit(1)
//             .execute()
//         )[0];

//         if (!dbToken) {
//           set.status = 401;
//           return 'Unauthorized';
//         }

//         const decodedRefreshToken = await refreshJWT.verify(refreshToken);

//         if (!decodedRefreshToken) {
//           set.status = 401;

//           db.delete(tokens).where(eq(tokens.token, refreshToken)).run();

//           return 'Unauthorized';
//         }

//         const authorizationToken = await jwt.sign({
//           name: decodedRefreshToken.name,
//           sub: decodedRefreshToken.sub
//         });

//         const newRefreshToken = await refreshJWT.sign({
//           name: decodedRefreshToken.name,
//           sub: decodedRefreshToken.sub
//         });

//         set.status = 200;
//         return {
//           token: authorizationToken,
//           refreshToken: newRefreshToken
//         };
//       },
//       {
//         body: t.Object({
//           refreshToken: t.String()
//         })
//       }
//     )
// )
// .get('/users', () => {
//   const allUsers = db
//     .select({
//       id: users.id,
//       name: users.name
//     })
//     .from(users)
//     .all();

//   return allUsers;
// });

app.listen(3333, server => {
  console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
});
