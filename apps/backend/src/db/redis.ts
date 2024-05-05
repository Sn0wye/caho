import Redis from 'ioredis';
import { env } from '@/env';

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis;
}

export const redis = global.redis || new Redis(env.REDIS_URL);

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}
