import { relations } from 'drizzle-orm';
import { keys, sessions, users } from './schema';

export const keysRelations = relations(users, ({ one }) => ({
  userId: one(keys, {
    fields: [users.id],
    references: [keys.userId]
  })
}));

export const sessionsRelations = relations(users, ({ one }) => ({
  userId: one(sessions, {
    fields: [users.id],
    references: [sessions.userId]
  })
}));
