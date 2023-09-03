import { playerSchema } from '@caho/schemas';
import { z } from 'zod';

export const joinRoom = z.object({
  roomCode: z.string().min(1),
  password: z.string().optional(),
  player: playerSchema
});

export type JoinRoom = z.infer<typeof joinRoom>;
