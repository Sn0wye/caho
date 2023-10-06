import { logger } from '@bogeychan/elysia-logger';
import { HoltLogger } from '@tlscipher/holt';
import { Elysia } from 'elysia';
import pretty from 'pino-pretty';
import { db } from '@/db';
import { redis } from '@/db/redis';
import { env } from '@/env';
import { auth } from './auth/lucia';

const stream = pretty({
  colorize: true
});

const loggerConfig =
  env.NODE_ENV === 'DEVELOPMENT'
    ? {
        level: 'debug',
        stream
      }
    : { level: 'silent' };

export const ctx = new Elysia({
  cookie: {
    secrets: env.COOKIE_SECRET,
    sign: ['session']
  }
})
  .decorate('redis', redis)
  .decorate('db', db)
  .decorate('auth', auth)
  .use(logger(loggerConfig))
  .use(new HoltLogger().getLogger())
  .derive(async ({ cookie, auth }) => {
    try {
      const session = await auth.getSession(cookie.session.value);
      console.log('sessionValue', session);
      return { session };
    } catch {
      return { session: null };
    }
  })
  .onStart(({ log }) => {
    if (log && env.NODE_ENV === 'PRODUCTION') {
      log.info('Server started');
    }
  })
  .onStop(({ log }) => {
    if (log && env.NODE_ENV === 'PRODUCTION') {
      log.info('Server stopped');
    }
  })
  .onRequest(({ log, request }) => {
    if (log && env.NODE_ENV === 'PRODUCTION') {
      log.debug(`Request received: ${request.method}: ${request.url}`);
    }
  })
  .onResponse(({ log, request }) => {
    if (log && env.NODE_ENV === 'PRODUCTION') {
      log.debug(`Response sent: ${request.method}: ${request.url}`);
    }
  })
  .onError(({ log, error }) => {
    if (log && env.NODE_ENV === 'PRODUCTION') {
      log.error(error);
    }
  });
