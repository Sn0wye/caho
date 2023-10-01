import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { ctx } from './context';
import { env } from './env';
import { authRoutes } from './routers/auth';
import { roomRoutes } from './routers/room';

const app = new Elysia()
  .use(ctx)
  .use(cors())
  .use(authRoutes)
  .use(roomRoutes)
  .get('/ping', () => 'pong');

app.listen(env.PORT || 8080, server => {
  console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
});

export type App = typeof app;
