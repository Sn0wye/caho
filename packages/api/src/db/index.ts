import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { env } from '@/env';
import * as relations from './relations';
import * as schema from './schema';

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD
});

const db = drizzle(connection, {
  schema: {
    ...schema,
    ...relations
  }
});

export { connection, db };
