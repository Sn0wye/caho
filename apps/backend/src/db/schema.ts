import { createId } from '@paralleldrive/cuid2';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id', {
    length: 24
  })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name', {
    length: 255
  }),
  email: text('email', {
    length: 255
  }),
  username: text('username', {
    length: 255
  }).notNull(),
  password: text('password', {
    length: 255
  }).notNull(),
  avatarUrl: text('avatar_url', {
    length: 255
  })
});

export const userSessions = sqliteTable('user_sessions', {
  id: text('id', {
    length: 255
  }).primaryKey(),
  userId: text('user_id', {
    length: 24
  })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
  expiresAt: integer('expires_at').notNull()
});
