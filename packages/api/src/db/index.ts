import { Database } from 'bun:sqlite';
import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

export const sqlite = new Database('sqlite.db');
const db: BunSQLiteDatabase = drizzle(sqlite);

migrate(db, { migrationsFolder: 'migrations' });

export { db };
