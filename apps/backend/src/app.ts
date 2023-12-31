import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySensible } from '@fastify/sensible';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyWebsocket from '@fastify/websocket';
import { fastify } from 'fastify';
import { db } from '@/db';
import { redis } from '@/db/redis';
import { env } from '@/env';
import { authRoutes } from './routes/auth';
import { roomRoutes } from './routes/room';

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>();

export type App = typeof app;

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: typeof redis;
  }
}

// decorators
app.decorate('db', db);
app.decorate('redis', redis);

// fastify plugins
app.register(fastifyWebsocket, {
  options: { maxPayload: 1048576 }
});

app.register(fastifyCors, {
  origin:
    env.NODE_ENV === 'production'
      ? 'https://caho.vercel.app'
      : 'http://localhost:3000',
  credentials: true
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
