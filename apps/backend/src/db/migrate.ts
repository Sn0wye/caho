import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '.';

migrate(db, { migrationsFolder: 'migrations' }).then(() => {
  console.log('All migrations ran successfull');
  process.exit(0);
});
