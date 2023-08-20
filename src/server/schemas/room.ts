import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { generateCode } from '../utils/generateCode';
import { playerSchema } from './player';

export const roomSchema = z.object({
  id: z
    .string()
    .optional()
    .default(() => createId()),
  code: z
    .string()
    .min(6)
    .max(6)
    .optional()
    .default(() => generateCode()),
  status: z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']).default('LOBBY'),
  password: z.string().optional(),
  maxPlayers: z.number().min(2).max(10).positive().int(),
  maxPoints: z
    .number()
    .min(1, {
      message: 'Deve ser maior que 1 ponto'
    })
    .max(30, {
      message: 'Deve ser menor que 30 pontos'
    })
    .positive()
    .int(),
  isPublic: z.boolean(),
  hostId: z.string().nonempty()
});

export type Room = z.infer<typeof roomSchema>;

export type RoomStatus = Room['status'];

export const createRoomSchema = z.object({
  room: roomSchema,
  host: playerSchema
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomCode: z.string().min(1),
  password: z.string().optional(),
  player: playerSchema
});

export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;

export const leaveRoomSchema = z.object({
  roomCode: z.string().min(1),
  playerId: z.string().min(1)
});

export type LeaveRoomSchema = z.infer<typeof leaveRoomSchema>;

export const startRoomSchema = z.object({
  roomCode: z.string().min(1),
  playerId: z.string().min(1)
});

export type StartRoomSchema = z.infer<typeof startRoomSchema>;
