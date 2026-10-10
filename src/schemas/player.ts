import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  avatarUrl: z.string().url().or(z.null()),
  isHost: z.coerce.boolean(),
  isReady: z.coerce.boolean().default(false),
  isJudge: z.coerce.boolean().default(false),
  // false = Inactive Player: the connection dropped but they stay in the Room.
  isActive: z.coerce.boolean().default(true),
  score: z.number().int().default(0),
  cardIds: z.array(z.string()).default([])
});

export type Player = z.infer<typeof playerSchema>;

// What the room channel broadcasts: no private Hand, no `isJudge` (derive it from
// the Round's `judgeId`).
export const roomPlayerSchema = playerSchema.omit({
  cardIds: true,
  isJudge: true
});

export type RoomPlayer = z.infer<typeof roomPlayerSchema>;
