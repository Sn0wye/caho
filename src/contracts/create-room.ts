import { z } from 'zod';

export const createRoom = z.object({
  // Bounds mirror the backend; a Room needs 3 Players to start.
  maxPlayers: z.number().int().min(3).max(10),
  maxPoints: z.number().int().min(1).max(30),
  isPublic: z.boolean(),
  password: z.string().or(z.null())
});

export type CreateRoom = z.infer<typeof createRoom>;
