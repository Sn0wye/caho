import { planetscale } from '@lucia-auth/adapter-mysql';
import { github, google } from '@lucia-auth/oauth/providers';
import { type Cookie } from 'elysia';
import { lucia, LuciaError } from 'lucia';
import { connection } from '@/db';
import { env } from '@/env';
import { elysiaMiddleware } from './middleware';

export const auth = lucia({
  env: env.NODE_ENV === 'PRODUCTION' ? 'PROD' : 'DEV',
  middleware: elysiaMiddleware(),
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

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/google/callback'
});

export type Auth = typeof auth;

// export type AuthGuardParams = Parameters<HookHandler>[0];

export const isAuthed = async ({
  cookie: { session },
  set
}: {
  cookie: Record<string, Cookie<string>>;
  set: {
    status?: number | string;
  };
}) => {
  if (!session.value) {
    set.status = 401;

    return `Unauthorized`;
  }

  try {
    const sessionInfo = await auth.validateSession(session.value);

    if (sessionInfo.fresh) {
      // expiration extended
      const sessionCookie = auth.createSessionCookie(sessionInfo);

      session.set({
        value: sessionCookie.value,
        httpOnly: true
      });
    }
  } catch (e) {
    if (e instanceof LuciaError && e.message === `AUTH_INVALID_SESSION_ID`) {
      session.remove();
    }

    set.status = 401;
    return `Unauthorized`;
  }
};
