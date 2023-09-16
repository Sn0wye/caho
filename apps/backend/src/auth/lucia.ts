import { SetCookieOptions } from '@elysiajs/cookie';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { type HookHandler } from 'elysia';
import { lucia, LuciaError } from 'lucia';
import { connection } from '@/db';
import { env } from '@/env';

export const auth = lucia({
  env: env.NODE_ENV === 'PRODUCTION' ? 'PROD' : 'DEV',
  adapter: planetscale(connection, {
    user: 'users',
    key: 'keys',
    session: 'sessions'
  })
});

export type Auth = typeof auth;

export type AuthGuardParams = Parameters<HookHandler>[0] & {
  cookie: Record<string, string>;
  setCookie: (
    name: string,
    value: string,
    options?: SetCookieOptions | undefined
  ) => void;
  unsignCookie: (value: string) =>
    | {
        valid: true;
        value: string;
      }
    | {
        valid: false;
        value: undefined;
      };
};

export const isAuthed = async ({
  body,
  cookie: { session },
  unsignCookie,
  setCookie,
  set
}: AuthGuardParams) => {
  if (!session) {
    set.status = 401;

    return `Unauthorized`;
  }

  try {
    const sessionInfo = await auth.validateSession(session);

    if (sessionInfo.fresh) {
      // expiration extended
      const sessionCookie = auth.createSessionCookie(sessionInfo);
      setCookie('session', sessionCookie.value, {
        httpOnly: true
      });
    }

    body = {
      // TODO: check this
      // @ts-ignore
      ...body,
      session: sessionInfo
    };
  } catch (e) {
    if (e instanceof LuciaError && e.message === `AUTH_INVALID_SESSION_ID`) {
      unsignCookie('session');
    }

    set.status = 401;
    return `Unauthorized`;
  }
};
