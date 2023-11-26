import { Redis } from '@upstash/redis';
import NodeRedis from 'ioredis';
import { env } from '@/env';

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
});

export const nodeRedis = new NodeRedis();
