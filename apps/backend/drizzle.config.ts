import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  driver: 'mysql2',
  dbCredentials: {
    uri: env.DATABASE_URL
  }
});
