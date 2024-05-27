import { db } from '@/db';
import { userSessions, users } from '@/db/schema';
import { env } from '@/env';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    // eslint-disable-next-line @typescript-eslint/ban-types
    DatabaseSessionAttributes: Record<string, never>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  avatarUrl: string | null;
  provider_id: string | null;
  provider_user_id: string | null;
};

const adapter = new DrizzlePostgreSQLAdapter(db, userSessions, users);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    name: 'auth_session',
    attributes: {
      secure: env.NODE_ENV === 'production'
      // path: '/'
    }
  },
  getUserAttributes: attributes => {
    return {
      id: attributes.id,
      name: attributes.name,
      username: attributes.username,
      email: attributes.email,
      avatarUrl: attributes.avatarUrl,
      providerId: attributes.provider_id,
      providerUserId: attributes.provider_user_id
    };
  },
  sessionExpiresIn: new TimeSpan(30, 'd')
});

import { GitHub, Google } from 'arctic';

export const githubAuth = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET
);

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URL
);

export type Auth = typeof auth;
