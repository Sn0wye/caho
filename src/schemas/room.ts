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
  prevJudgeId: z.string().min(1).or(z.null()).default(null),
  judgeId: z.string().min(1).or(z.null()).default(null),
  round: z.number().int().min(0).positive().default(0),
  pickedWhiteCards: z.array(z.string()).default([]),
  pickedBlackCards: z.array(z.string()).default([]),
  currentBlackCardId: z.string().or(z.null()).default(null),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

// A LOBBY Room as the rooms page lists it. Every Room is listed; hasPassword
// says whether joining needs one.
export const roomListingSchema = z.object({
  id: z.string(),
  code: z.string(),
  maxPlayers: z.number(),
  maxPoints: z.number(),
  playerCount: z.number(),
  hostUsername: z.string(),
  hasPassword: z.boolean()
});

// What the backend serves for any Room read, create and join: the stored Room
// with its password reduced to hasPassword. Written out because roomSchema
// parses form input, which a stored Room would fail.
export const sanitizedRoomSchema = z.object({
  id: z.string(),
  code: z.string(),
  maxPlayers: z.number().int(),
  maxPoints: z.number().int(),
  status: z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']),
  hostId: z.string(),
  hasPassword: z.boolean(),
  prevJudgeId: z.string().nullable(),
  judgeId: z.string().nullable(),
  round: z.number().int(),
  pickedWhiteCards: z.array(z.string()),
  pickedBlackCards: z.array(z.string()),
  currentBlackCardId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type Room = z.infer<typeof roomSchema>;

export type SanitizedRoom = z.infer<typeof sanitizedRoomSchema>;

export type RoomStatus = Room['status'];

export type RoomListing = z.infer<typeof roomListingSchema>;
