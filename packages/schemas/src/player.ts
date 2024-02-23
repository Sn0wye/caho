import { z } from 'zod';
import { cardSchema } from './card';

export const playerSchema = z.object({
  id: z.string().min(1),
  score: z.coerce.number().min(0),
  username: z.string().min(1),
  avatarUrl: z.string().url().or(z.null()),
  isHost: z.coerce.boolean(),
  isReady: z.coerce.boolean().default(false),
  isJudge: z.coerce.boolean().default(false),
  cards: z.array(cardSchema).default([])
});

export type Player = z.infer<typeof playerSchema>;
