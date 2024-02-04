import { createId } from '@paralleldrive/cuid2';
import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', {
    length: 24
  })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar('name', {
    length: 255
  }),
  email: varchar('email', {
    length: 255
  }),
  username: varchar('username', {
    length: 255
  }).notNull(),
  avatarUrl: varchar('avatar_url', {
    length: 255
  })
});

export const userSessions = mysqlTable('user_sessions', {
  id: varchar('id', {
    length: 128
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15
  })
    .notNull()
    .references(() => users.id),
  expiresAt: datetime('expires_at').notNull()
});
