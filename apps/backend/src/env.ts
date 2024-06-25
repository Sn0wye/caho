import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8080),
    NODE_ENV: z.enum(['production', 'development', 'test']),
    COOKIE_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URL: z.string().min(1),
    FRONTEND_AUTH_REDIRECT_URL: z.string().min(1)
  },
  runtimeEnv: process.env
});
