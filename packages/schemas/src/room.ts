import { z } from 'zod';

export const roomSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(6).max(6),
  maxPlayers: z.coerce.number().min(2).max(10).positive(),
  maxPoints: z.coerce
    .number()
    .min(1, {
      message: 'Deve ser maior que 1 ponto'
    })
    .max(30, {
      message: 'Deve ser menor que 30 pontos'
    })
    .positive(),
  status: z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']),
  hostId: z.string().min(1),
  password: z
    .string()
    .or(z.null())
    .transform(v => (v === '' || v === undefined ? null : v)),
  isPublic: z.string().transform(v => v === 'true'),
  prevJudgeId: z.string().min(1).or(z.null()).default(null),
  judgeId: z.string().min(1).or(z.null()).default(null),
  round: z.number().int().min(0).positive().default(0)
});

export const roomStateSchema = z.object({
  round: z.number().min(0).nonnegative().default(0),
  judgeId: z.string().min(1).or(z.null()).default(null),
  prevJudgeId: z.string().min(1).or(z.null()).default(null)
});

export const publicRoomWithPlayerCountAndHost = z.object({
  id: z.string(),
  code: z.string(),
  maxPlayers: z.number(),
  maxPoints: z.number(),
  playerCount: z.number(),
  hostUsername: z.string()
});

export const sanitizedRoomSchema = roomSchema.omit({ password: true });

export type Room = z.infer<typeof roomSchema>;

export type SanitizedRoom = z.infer<typeof sanitizedRoomSchema>;

export type RoomStatus = Room['status'];

export type RoomState = z.infer<typeof roomStateSchema>;

export type PublicRoomWithPlayerCountAndHost = z.infer<
  typeof publicRoomWithPlayerCountAndHost
>;
