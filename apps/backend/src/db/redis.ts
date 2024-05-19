import { env } from '@/env';
import Redis from 'ioredis';

declare global {
  var redis: Redis;
}

// biome-ignore lint/suspicious/noRedeclare: singleton
export const redis = global.redis || new Redis(env.REDIS_URL);

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}
