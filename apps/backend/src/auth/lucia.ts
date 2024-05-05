// import { github, google } from '@lucia-auth/oauth/providers';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';
import { db } from '@/db';
import { users, userSessions } from '@/db/schema';
import { env } from '@/env';

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
  getUserAttributes: databaseUser => {
    return {
      id: databaseUser.id,
      name: databaseUser.name,
      username: databaseUser.username,
      email: databaseUser.email,
      avatarUrl: databaseUser.avatarUrl
    };
  },
  sessionExpiresIn: new TimeSpan(30, 'd')
});

// TODO: review & update this to v3
// export const githubAuth = github(auth, {
//   clientId: env.GITHUB_CLIENT_ID,
//   clientSecret: env.GITHUB_CLIENT_SECRET
// });

// TODO: review & update this to v3
// export const googleAuth = google(auth, {
//   clientId: env.GOOGLE_CLIENT_ID,
//   clientSecret: env.GOOGLE_CLIENT_SECRET,
//   redirectUri: 'http://localhost:3000/auth/google/callback'
// });

export type Auth = typeof auth;

// export const getSessionFromToken = async (
//   token?: string
// ): Promise<
//   | {
//       user: User;
//       session: Session;
//     }
//   | {
//       user: null;
//       session: null;
//     }
// > => {
//   // const cookie = req.cookies['auth_session'];
//   if (!token) {
//     return {
//       user: null,
//       session: null
//     };
//   }
//   const sessionAndUser = await auth.validateSession(token);
//   if (!sessionAndUser) {
//     return {
//       user: null,
//       session: null
//     };
//   }
//   return sessionAndUser;
// };
