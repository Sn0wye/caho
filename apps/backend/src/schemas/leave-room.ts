import { z } from 'zod';

export const leaveRoomInput = z.object({
  roomCode: z.string().length(6),
  playerId: z.string().min(1)
});

export type LeaveRoomInput = z.infer<typeof leaveRoomInput>;
