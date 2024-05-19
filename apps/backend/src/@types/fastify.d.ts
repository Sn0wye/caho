import 'fastify';
import type { Pubsub } from '@/lib/pub-sub';
import type { Redis } from 'ioredis';
import type { Session, User } from 'lucia';

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: Redis;
    pubsub: Pubsub;
  }

  interface FastifyRequest {
    getUser(): User;
    getSession(): Session;
  }
}
