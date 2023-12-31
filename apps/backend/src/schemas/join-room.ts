import { playerSchema } from '@caho/schemas';
import { z } from 'zod';

export const joinRoomInput = z.object({
  roomCode: z.string().length(6),
  password: z.string().or(z.null()),
  player: playerSchema
});

export type JoinRoomInput = z.infer<typeof joinRoomInput>;
