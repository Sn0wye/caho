import { z } from 'zod';
import { roomSchema } from '@/schemas';

export const joinRoomRequest = z.object({
  roomCode: z
    .string()
    .min(6)
    .max(6, {
      message: 'O código da sala deve ter 6 dígitos.'
    })
    .transform(value => value.toUpperCase()),
  password: z.string().or(z.null())
});

export type JoinRoomRequest = z.infer<typeof joinRoomRequest>;

export const joinRoomResponse = roomSchema;

export type JoinRoomResponse = z.infer<typeof joinRoomResponse>;
