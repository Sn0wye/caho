import { PlanetScaleAdapter } from '@lucia-auth/adapter-mysql';
// import { github, google } from '@lucia-auth/oauth/providers';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { Lucia, TimeSpan, type Session, type User } from 'lucia';
import { connection } from '@/db';
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
  avatar_url: string | null;
};

const adapter = new PlanetScaleAdapter(connection, {
  user: 'users',
  session: 'user_sessions'
});

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
      avatarUrl: databaseUser.avatar_url
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

/**
 * Get session from the request, return 401 if not found
 * @param req FastifyRequest
 * @param res FastifyReply
 * @returns Session
 */
export const validateSession = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<{
  user: User;
  session: Session;
}> => {
  const cookie = req.cookies['auth_session'];
  if (!cookie) {
    return res.unauthorized();
  }

  const sessionAndUser = await auth.validateSession(cookie);
  if (!sessionAndUser.session || !sessionAndUser.user) {
    return res.unauthorized();
  }
  return sessionAndUser;
};

export const getSessionFromToken = async (
  token?: string
): Promise<
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    }
> => {
  // const cookie = req.cookies['auth_session'];
  if (!token) {
    return {
      user: null,
      session: null
    };
  }
  const sessionAndUser = await auth.validateSession(token);
  if (!sessionAndUser) {
    return {
      user: null,
      session: null
    };
  }
  return sessionAndUser;
};
