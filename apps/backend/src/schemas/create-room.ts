import { playerSchema } from '@caho/schemas';
import { z } from 'zod';

export const createRoomInput = z.object({
  hostId: z.string().min(1),
  maxPlayers: z.number().int().positive(),
  maxPoints: z.number().int().positive(),
  isPublic: z.boolean(),
  password: z.string().or(z.null()),
  host: playerSchema
});

export type CreateRoomInput = z.infer<typeof createRoomInput>;
