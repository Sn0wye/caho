import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider_id', ['github', 'google']);

export const users = pgTable('users', {
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
  password: varchar('password', {
    length: 255
  }).notNull(),
  avatarUrl: varchar('avatar_url', {
    length: 255
  })
});

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    providerId: providerEnum('provider_id'),
    providerUserId: varchar('provider_user_id').unique(),
    userId: varchar('user_id', {
      length: 24
    })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  table => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
  })
);

export const userSessions = pgTable('user_sessions', {
  id: varchar('id', {
    length: 255
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 24
  })
    .notNull()
    .references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const rooms = pgTable(
  'rooms',
  {
    id: varchar('id', {
      length: 24
    })
      .primaryKey()
      .$defaultFn(() => createId()),
    code: varchar('code', {
      length: 6
    })
      .unique()
      .notNull(),
    maxPlayers: integer('max_players').notNull(),
    maxPoints: integer('max_points').notNull(),
    password: varchar('password', {
      length: 255
    }),
    status: varchar('status', {
      enum: ['LOBBY', 'IN_PROGRESS', 'FINISHED'],
      length: 255
    }).notNull(),
    hostId: varchar('host_id', {
      length: 24
    })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    isPublic: boolean('is_public').notNull(),
    round: integer('round').notNull().default(0),
    judgeId: varchar('judge_id', {
      length: 24
    }).references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    prevJudgeId: varchar('prev_judge_id', {
      length: 24
    }).references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    currentBlackCardId: varchar('current_black_card_id', { length: 24 }),
    pickedWhiteCards: varchar('picked_white_cards', { length: 24 })
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    pickedBlackCards: varchar('picked_black_cards', { length: 24 })
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  table => ({
    codeIdx: uniqueIndex('code_unique_idx').on(table.code)
  })
);

export const roomPlayers = pgTable(
  'room_players',
  {
    roomCode: varchar('room_code', {
      length: 6
    })
      .notNull()
      .references(() => rooms.code, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    playerId: varchar('user_id', {
      length: 24
    })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    score: integer('score').notNull(),
    isReady: boolean('is_ready').notNull(),
    isHost: boolean('is_host').notNull(),
    isJudge: boolean('is_judge').notNull(),
    cardIds: varchar('card_ids', { length: 24 })
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`)
  },
  table => ({
    pk: primaryKey({ columns: [table.roomCode, table.playerId] })
  })
);

export const roomRelations = relations(rooms, ({ many }) => ({
  players: many(roomPlayers)
}));

export const roomPlayersRelations = relations(roomPlayers, ({ one }) => ({
  player: one(users, {
    fields: [roomPlayers.playerId],
    references: [users.id]
  }),
  room: one(rooms, {
    fields: [roomPlayers.roomCode],
    references: [rooms.code]
  })
}));
