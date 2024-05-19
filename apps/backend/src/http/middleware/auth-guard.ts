// import { UnauthorizedError } from '@/errors';
// import type { FastifyInstance, FastifyRequest } from 'fastify';
// import fastifyPlugin from 'fastify-plugin';
// import type { Session, User } from 'lucia';

// function isAuthenticated(req: FastifyRequest): req is FastifyRequest & {
//   user: User;
//   session: Session;
// } {
//   return !!req.session && !!req.user;
// }

// export const authGuard = fastifyPlugin(
//   async (app: FastifyInstance) => {
//     app.addHook('preHandler', req => {
//       if (!isAuthenticated(req)) {
//         throw new UnauthorizedError('Unauthorized');
//       }

//       return;
//     });
//   },
//   {
//     name: 'authGuard',
//     fastify: '4.x'
//   }
// );
