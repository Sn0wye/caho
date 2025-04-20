import { whiteCard } from '@caho/schemas';
import { z } from 'zod';

// This is only duplicated because union needs at least 2 elements.
// Remove the second one as more player events are added
const playerEvent = z.union([
  z.object({
    event: z.literal('player.cards-drawn'),
    payload: z.array(whiteCard)
  }),
  z.object({
    event: z.literal('player.cards-drawn'),
    payload: z.array(whiteCard)
  })
]);

export type PlayerEvent = z.infer<typeof playerEvent>;
