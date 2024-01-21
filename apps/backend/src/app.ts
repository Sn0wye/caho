import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySensible } from '@fastify/sensible';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastify } from 'fastify';
import { db } from '@/db';
import { redis } from '@/db/redis';
import { env } from '@/env';
import { authRoutes } from './http/routes/auth';
import { roomRoutes } from './http/routes/room';
import { fastifySocketIO } from './plugins/socketio';

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>();

export type App = typeof app;

// decorators
app.decorate('db', db);
app.decorate('redis', redis);

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: typeof redis;
  }
}

const corsOpts = {
  origin:
    env.NODE_ENV === 'production'
      ? 'https://caho.vercel.app'
      : 'http://localhost:3000',
  credentials: true
};

// plugins
app.register(fastifyCors, corsOpts);
app.register(fastifySocketIO, {
  pingInterval: 1000,
  cors: corsOpts
});
app.register(fastifySensible);
app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
  hook: 'onRequest',
  parseOptions: {}
});

// routes
app.register(authRoutes, {
  prefix: '/auth'
});
app.register(roomRoutes, {
  prefix: '/rooms'
});
app.get('/ping', () => 'pong');
