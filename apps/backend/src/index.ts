import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { redis } from './db/redis';
import { env } from './env';
import { authRoutes } from './routers/auth';
import { roomRoutes } from './routers/room';

const setup = (app: Elysia) => app.state('redis', redis);

const app = new Elysia()
  .use(setup)
  .use(cors())
  .use(authRoutes)
  .use(roomRoutes)
  .get('/ping', () => 'pong');

app.listen(env.PORT || 8080, server => {
  console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
});

export type App = typeof app;
