import 'fastify';
import { type Redis } from 'ioredis';
import { type Pubsub } from '@/lib/pub-sub';

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: Redis;
    pubsub: Pubsub;
  }
}
