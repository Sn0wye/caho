import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  driver: 'pg',
  verbose: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL
  }
});
