import { z } from 'zod';
import { playerSchema } from './player';

export const roomSchema = z.object({
  id: z.string().min(1),
  password: z.string().optional(),
  maxPlayers: z.number().min(2).max(10).positive(),
  maxPoints: z.number().min(1).max(30).positive(),
  isPublic: z.boolean(),
  status: z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']),
  players: z.array(playerSchema),
  hostId: z.string().min(1)
});

export type Room = z.infer<typeof roomSchema>;

export const createRoomSchema = roomSchema.omit({
  id: true,
  status: true
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomId: z.string().min(1),
  password: z.string().optional(),
  player: playerSchema
});

export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;

export const leaveRoomSchema = z.object({
  roomId: z.string().min(1),
  playerId: z.string().min(1)
});

export type LeaveRoomSchema = z.infer<typeof leaveRoomSchema>;

export const startRoomSchema = z.object({
  roomId: z.string().min(1),
  playerId: z.string().min(1)
});

export type StartRoomSchema = z.infer<typeof startRoomSchema>;
