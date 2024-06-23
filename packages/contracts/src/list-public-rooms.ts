import { z } from 'zod';

export const listPublicRoomsResponse = z.object({
  id: z.string(),
  code: z.string(),
  maxPlayers: z.number(),
  maxPoints: z.number(),
  playerCount: z.number()
});

export type ListPublicRoomsResponse = z.infer<typeof listPublicRoomsResponse>;
