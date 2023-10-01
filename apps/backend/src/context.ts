import { Elysia } from 'elysia';
import { db } from '@/db';
import { redis } from '@/db/redis';
import { env } from '@/env';
import { auth } from './auth/lucia';

export const ctx = new Elysia({
  cookie: {
    secrets: env.COOKIE_SECRET,
    sign: ['session']
  }
})
  .decorate('redis', redis)
  .decorate('db', db)
  .decorate('auth', auth)
  .derive(async ({ auth, ...ctx }) => {
    const authRequest = auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  });
