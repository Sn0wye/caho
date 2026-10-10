import { z } from 'zod';
import { whiteCard } from '@/schemas';

export const playerEvent = z.object({
  event: z.literal('player.cards-drawn'),
  // The whole refilled Hand, not just the new cards.
  payload: z.array(whiteCard)
});

export type PlayerEvent = z.infer<typeof playerEvent>;
