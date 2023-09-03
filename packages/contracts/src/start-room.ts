import { z } from 'zod';

export const startRoom = z.object({
  roomCode: z.string().min(1),
  playerId: z.string().min(1)
});

export type StartRoom = z.infer<typeof startRoom>;
