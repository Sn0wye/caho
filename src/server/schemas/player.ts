import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string(),
  score: z.number().min(0),
  username: z.string().min(1),
  avatarUrl: z.string().url().nullish(),
  isHost: z.boolean()
});

export type PlayerSchema = z.infer<typeof playerSchema>;

export const playersSchema = z.array(playerSchema);

export type PlayersSchema = z.infer<typeof playersSchema>;
