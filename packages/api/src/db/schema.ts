import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull()
});

export const tokens = sqliteTable(
  'tokens',
  {
    id: text('id').primaryKey(),
    token: text('token').notNull(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull()
  },
  table => ({
    userIdIdx: index('user_id_idx').on(table.userId)
  })
);
