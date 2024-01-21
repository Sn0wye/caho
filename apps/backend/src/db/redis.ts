import Redis from 'ioredis';
import { env } from '@/env';

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis;
}

export const redisOpts =
  env.NODE_ENV === 'production'
    ? {
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        host: env.REDIS_HOST,
        port: 6379,
        family: 6
      }
    : {
        host: 'localhost',
        port: 6379
      };

export const redis = global.redis || new Redis(redisOpts);

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}
