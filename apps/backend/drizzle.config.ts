import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  driver: 'turso',
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
  }
});
