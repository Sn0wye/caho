import { type SetCookieOptions } from '@elysiajs/cookie';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { github } from '@lucia-auth/oauth/providers';
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

export const githubAuth = github(auth, {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET
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

    // body = {
    //   ...body,
    //   session: sessionInfo
    // };
  } catch (e) {
    if (e instanceof LuciaError && e.message === `AUTH_INVALID_SESSION_ID`) {
      unsignCookie('session');
    }

    set.status = 401;
    return `Unauthorized`;
  }
};
