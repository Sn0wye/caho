import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
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
    pickedWhiteCards: varchar('picked_white_cards')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    pickedBlackCards: varchar('picked_black_cards')
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

export const rounds = pgTable(
  'rounds',
  {
    id: varchar('id', { length: 24 })
      .primaryKey()
      .$defaultFn(() => createId()),
    roomCode: varchar('room_code', { length: 6 })
      .notNull()
      .references(() => rooms.code, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    roundNumber: integer('round_number').notNull(),
    blackCardId: varchar('black_card_id', { length: 24 }).notNull(),
    judgeId: varchar('judge_id', { length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    roundWinnerId: varchar('round_winner_id', { length: 24 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  table => ({
    roomCodeIdx: uniqueIndex('rounds_room_code_idx').on(
      table.roomCode,
      table.roundNumber
    ),
    judgeIdIdx: index('rounds_judge_id_idx').on(table.judgeId)
  })
);

export const roundPlayedCards = pgTable(
  'round_played_cards',
  {
    id: varchar('id', { length: 24 })
      .primaryKey()
      .$defaultFn(() => createId()),
    roundId: varchar('round_id', { length: 24 })
      .notNull()
      .references(() => rounds.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    playerId: varchar('player_id', { length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  table => ({
    roundIdIdx: index('round_played_cards_round_id_idx').on(table.roundId),
    playerIdIdx: index('round_played_cards_player_id_idx').on(table.playerId)
  })
);

export const roundPlayedCardWhiteCards = pgTable(
  'round_played_card_white_cards',
  {
    roundPlayedCardId: varchar('round_played_card_id', { length: 24 })
      .notNull()
      .references(() => roundPlayedCards.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    whiteCardId: varchar('white_card_id', { length: 24 })
      .notNull()
      .references(() => whiteCards.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  table => ({
    pk: primaryKey({ columns: [table.roundPlayedCardId, table.whiteCardId] })
  })
);

export const cardPacks = pgTable(
  'card_packs',
  {
    id: varchar('id', { length: 24 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar('name', {
      length: 255
    }).notNull(),
    slug: varchar('slug', {
      length: 255
    }).notNull()
  },
  table => ({
    nameIdx: uniqueIndex('card_packs_name_idx').on(table.name)
  })
);

export const whiteCards = pgTable('white_cards', {
  id: varchar('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  text: varchar('text', { length: 255 }).notNull(),
  packId: varchar('pack_id', { length: 24 })
    .notNull()
    .references(() => cardPacks.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
});

export const blackCards = pgTable('black_cards', {
  id: varchar('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  text: varchar('text', { length: 255 }).notNull(),
  pick: integer('pick').notNull(),
  packId: varchar('pack_id', { length: 24 })
    .notNull()
    .references(() => cardPacks.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
});

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

export const roundsRelations = relations(rounds, ({ one, many }) => ({
  room: one(rooms, {
    fields: [rounds.roomCode],
    references: [rooms.code]
  }),
  judge: one(users, {
    fields: [rounds.judgeId],
    references: [users.id]
  }),
  roundWinner: one(roundPlayedCards, {
    fields: [rounds.roundWinnerId],
    references: [roundPlayedCards.id]
  }),
  roundPlayedCards: many(roundPlayedCards)
}));

export const roundPlayedCardsRelations = relations(
  roundPlayedCards,
  ({ one, many }) => ({
    round: one(rounds, {
      fields: [roundPlayedCards.roundId],
      references: [rounds.id]
    }),
    player: one(users, {
      fields: [roundPlayedCards.playerId],
      references: [users.id]
    }),
    whiteCards: many(roundPlayedCardWhiteCards)
  })
);

export const roundPlayedCardWhiteCardsRelations = relations(
  roundPlayedCardWhiteCards,
  ({ one }) => ({
    roundPlayedCard: one(roundPlayedCards, {
      fields: [roundPlayedCardWhiteCards.roundPlayedCardId],
      references: [roundPlayedCards.id]
    }),
    whiteCard: one(whiteCards, {
      fields: [roundPlayedCardWhiteCards.whiteCardId],
      references: [whiteCards.id]
    })
  })
);

export const cardPacksRelations = relations(cardPacks, ({ many }) => ({
  whiteCards: many(whiteCards),
  blackCards: many(blackCards)
}));
