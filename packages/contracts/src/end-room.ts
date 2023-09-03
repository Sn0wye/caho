import { z } from 'zod';

export const endRoom = z.object({
  roomCode: z.string().min(1),
  playerId: z.string().min(1)
});

export type EndRoom = z.infer<typeof endRoom>;
