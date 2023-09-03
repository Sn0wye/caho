import { z } from 'zod';

export const leaveRoom = z.object({
  roomCode: z.string().min(1),
  playerId: z.string().min(1)
});

export type LeaveRoom = z.infer<typeof leaveRoom>;
