import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string().min(1),
  score: z.number().min(0),
  username: z.string().min(1),
  avatarUrl: z.string().url().nullish(),
  isHost: z.boolean()
});

export type Player = z.infer<typeof playerSchema>;
