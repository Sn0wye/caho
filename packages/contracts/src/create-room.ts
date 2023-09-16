import { z } from 'zod';

export const createRoom = z.object({
  maxPlayers: z.number().int().positive(),
  maxPoints: z.number().int().positive(),
  isPublic: z.boolean(),
  password: z.string().or(z.null())
});

export type CreateRoom = z.infer<typeof createRoom>;
