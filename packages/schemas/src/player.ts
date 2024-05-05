import { z } from 'zod';
import { cardSchema } from './card';

export const playerSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  avatarUrl: z.string().url().or(z.null()),
  isHost: z.coerce.boolean(),
  isReady: z.coerce.boolean().default(false),
  isJudge: z.coerce.boolean().default(false),
  score: z.number().int().default(0)
});

export type Player = z.infer<typeof playerSchema>;
