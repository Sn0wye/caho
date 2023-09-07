import { type Config } from 'drizzle-kit';
import { env } from '@/env';

export default {
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  driver: 'mysql2',
  dbCredentials: {
    // database: 'caho',
    // user: env.DATABASE_USERNAME,
    // password: env.DATABASE_PASSWORD,
    // host: env.DATABASE_HOST
    connectionString: env.DATABASE_URL
  }
} satisfies Config;
