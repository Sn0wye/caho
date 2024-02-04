import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8080),
    NODE_ENV: z.enum(['production', 'development']),
    COOKIE_SECRET: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    REDIS_USERNAME: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1)
  },
  runtimeEnv: process.env
});
