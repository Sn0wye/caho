import { env } from '@/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const client = new pg.Pool({
  connectionString: env.DATABASE_URL
});

export const db = drizzle(client, {
  schema,
  logger: true
});
