import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string().min(1),
  score: z.coerce.number().min(0),
  username: z.string().min(1),
  avatarUrl: z.string().url().or(z.null()),
  isHost: z.coerce.boolean()
});

export type Player = z.infer<typeof playerSchema>;
