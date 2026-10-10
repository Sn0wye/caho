import { z } from 'zod';
import { blackCard, whiteCard } from './card';

export const roundStatusSchema = z.enum([
  'PLAYING',
  'JUDGING',
  'COMPLETE',
  'ABORTED'
]);

export type RoundStatus = z.infer<typeof roundStatusSchema>;

export const roundPlayedCardsSchema = z.object({
  id: z.string(),
  roundId: z.string(),
  player: z.object({
    id: z.string(),
    username: z.string(),
    avatarUrl: z.string().nullable()
  }),
  // In the order played; matters for pick 2/3.
  whiteCards: z.array(whiteCard),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type RoundPlayedCard = z.infer<typeof roundPlayedCardsSchema>;

// `GET /rooms/:code/round`: the current Round, `null` before the game starts.
export const roundSnapshotSchema = z.object({
  roundNumber: z.number().int(),
  status: roundStatusSchema,
  judgeId: z.string(),
  playDeadline: z.coerce.date().nullable(),
  judgeDeadline: z.coerce.date().nullable(),
  blackCard: blackCard.nullable(),
  roundPlayedCards: z.array(roundPlayedCardsSchema)
});

export type RoundSnapshot = z.infer<typeof roundSnapshotSchema>;
