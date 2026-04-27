import { z } from 'zod';
import { playerSchema } from './player';

export const rankingSchema = z.array(
  playerSchema.omit({
    cardIds: true,
    isHost: true,
    isJudge: true,
    isReady: true
  })
);

export type Ranking = z.infer<typeof rankingSchema>;
