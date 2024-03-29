// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_LIVEBLOCKS_API_KEY: z.string().min(1)
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_LIVEBLOCKS_API_KEY: process.env.NEXT_PUBLIC_LIVEBLOCKS_API_KEY
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
