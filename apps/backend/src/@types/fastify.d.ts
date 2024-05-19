import 'fastify';
import type { Pubsub } from '@/lib/pub-sub';
import type { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: Redis;
    pubsub: Pubsub;
  }
}
