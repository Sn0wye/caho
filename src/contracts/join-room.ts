import { z } from 'zod';
import { sanitizedRoomSchema } from '@/schemas';

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

// The joined Room, without its password.
export const joinRoomResponse = sanitizedRoomSchema;

export type JoinRoomResponse = z.infer<typeof joinRoomResponse>;
