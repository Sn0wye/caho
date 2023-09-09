import { bigint, index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', {
    length: 24 // cuid
  }).primaryKey(),
  name: varchar('name', {
    length: 255
  }),
  lastName: varchar('last_name', {
    length: 255
  }),
  email: varchar('email', {
    length: 255
  }),
  username: varchar('username', {
    length: 255
  }).notNull()
});

export const keys = mysqlTable('keys', {
  id: varchar('id', {
    length: 255
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 24
  }).notNull(),
  hashedPassword: varchar('hashed_password', {
    length: 255
  })
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', {
    length: 128
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15
  }).notNull(),
  activeExpires: bigint('active_expires', {
    mode: 'number'
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number'
  }).notNull()
});
