import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '.';

async function main() {
  await migrate(db, { migrationsFolder: 'migrations' });

  console.log('✅ All migrations ran successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
