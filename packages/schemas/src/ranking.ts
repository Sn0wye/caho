import { z } from 'zod';
import { playerSchema } from './player';

export const rankingSchema = z.array(
  z.object({
    score: z.number().int().positive(),
    player: playerSchema
  })
);

export type Ranking = z.infer<typeof rankingSchema>;
