import { whiteCard } from '@caho/schemas';
import { z } from 'zod';

const playerEvent = z.union([
  z.object({
    event: z.literal('player.cards-drawn'),
    payload: z.array(whiteCard).length(6)
  }),
  z.object({
    event: z.literal('player.cards-drawn'),
    payload: z.array(whiteCard).length(6)
  })
]);

export type PlayerEvent = z.infer<typeof playerEvent>;
