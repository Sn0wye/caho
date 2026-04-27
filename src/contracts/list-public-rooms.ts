import { z } from 'zod';

export const listPublicRoomsResponse = z.array(
  z.object({
    id: z.string(),
    code: z.string(),
    maxPlayers: z.number(),
    maxPoints: z.number(),
    playerCount: z.number(),
    hostUsername: z.string()
  })
);

export type ListPublicRoomsResponse = z.infer<typeof listPublicRoomsResponse>;
