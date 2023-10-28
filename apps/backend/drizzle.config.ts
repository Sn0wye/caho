import { type Config } from 'drizzle-kit';
import { env } from '@/env';

export default {
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env.DATABASE_URL
  }
} satisfies Config;
