import { whiteCard } from './card';
import { playerSchema } from './player';
import { roomSchema } from './room';
import { userSchema } from './user';
import { z } from 'zod';

export const roundSchema = z.object({
  id: z.string(),
  roomCode: z.string().length(6),
  roundNumber: z.number().int(),
  blackCardId: z.string(),
  judgeId: z.string(),
  roundWinnerId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export const roundPlayedCardsSchema = z.object({
  id: z.string(),
  roundId: z.string(),
  player: userSchema,
  whiteCards: z.array(whiteCard),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export const roundWithRelations = roundSchema.extend({
  room: roomSchema,
  judge: playerSchema,
  roundWinner: roundPlayedCardsSchema.nullable(),
  roundPlayedCards: z.array(roundPlayedCardsSchema)
});

export type Round = z.infer<typeof roundSchema>;
export type RoundWithRelations = z.infer<typeof roundWithRelations>;
export type RoundPlayedCard = z.infer<typeof roundPlayedCardsSchema>;
