import { planetscale } from '@lucia-auth/adapter-mysql';
import { github, google } from '@lucia-auth/oauth/providers';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { lucia } from 'lucia';
import { fastify } from 'lucia/middleware';
import { connection } from '@/db';
import { env } from '@/env';

export const auth = lucia({
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: fastify(),
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

/**
 * Get session from the request, return 401 if not found
 * @param req FastifyRequest
 * @param res FastifyReply
 * @returns Session
 */
export const getSession = async (req: FastifyRequest, res: FastifyReply) => {
  const cookie = req.cookies['auth_session'];
  if (!cookie) {
    return res.unauthorized();
  }
  const session = await auth.validateSession(cookie);
  if (!session) {
    return res.unauthorized();
  }
  return session;
};
