import { roomSchema } from '@caho/schemas';
import { z } from 'zod';

export const joinRoomRequest = z.object({
  roomCode: z.string().min(1),
  password: z.string().or(z.null())
});

export type JoinRoomRequest = z.infer<typeof joinRoomRequest>;

export const joinRoomResponse = roomSchema;

export type JoinRoomResponse = z.infer<typeof joinRoomResponse>;
