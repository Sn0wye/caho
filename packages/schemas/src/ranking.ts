import { z } from 'zod';
import { playerSchema } from './player';

export const rankingSchema = z.array(playerSchema);

export type Ranking = z.infer<typeof rankingSchema>;
