import { z } from 'zod';
import { playerSchema } from './player';

export const rankingSchema = z.array(
  z.object({
    score: z.number().min(0),
    member: playerSchema
  })
);

export type RankingSchema = z.infer<typeof rankingSchema>;
