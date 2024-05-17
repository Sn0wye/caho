import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  migrations: {
    schema: './src/db/schema.ts',
    table: 'migrations'
  },
  breakpoints: true,
  dialect: 'postgresql',
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
