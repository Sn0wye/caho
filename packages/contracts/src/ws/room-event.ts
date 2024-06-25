import { blackCard, playerSchema, roomSchema } from '@caho/schemas';
import { z } from 'zod';

export const roomEvent = z.union([
  z.object({
    event: z.literal('message'),
    payload: z.object({ message: z.string() })
  }),
  z.object({
    event: z.literal('player-joined'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('player-left'),
    payload: z.object({
      id: z.string()
    })
  }),
  z.object({
    event: z.literal('player-update'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('room-started'),
    payload: roomSchema
  }),
  z.object({
    event: z.literal('black-card-drawn'),
    payload: blackCard
  })
]);

export type RoomEvent = z.infer<typeof roomEvent>;
