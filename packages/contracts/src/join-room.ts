import { z } from 'zod';

export const joinRoom = z.object({
  roomCode: z.string().min(1),
  password: z.string().or(z.null())
});

export type JoinRoom = z.infer<typeof joinRoom>;
