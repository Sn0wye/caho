import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
import { db } from '.';

migrate(db, { migrationsFolder: 'migrations' });
