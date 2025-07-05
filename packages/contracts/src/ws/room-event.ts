import {
  blackCard,
  playerSchema,
  roomSchema,
  roundPlayedCardsSchema
} from '@caho/schemas';
import { z } from 'zod';

export const roomEvent = z.union([
  z.object({
    event: z.literal('room.message'),
    payload: z.object({ message: z.string() })
  }),
  z.object({
    event: z.literal('room.player-joined'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('room.player-left'),
    payload: z.object({
      id: z.string()
    })
  }),
  z.object({
    event: z.literal('room.player-update'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('room.started'),
    payload: roomSchema
  }),
  z.object({
    event: z.literal('room.round-start'),
    payload: z.object({
      roundNumber: z.number().int(),
      blackCard: blackCard
    })
  }),
  z.object({
    event: z.literal('room.time-to-judge'),
    payload: z.object({
      roundPlayedCards: z.array(roundPlayedCardsSchema)
    })
  }),
  z.object({
    event: z.literal('room.round-end'),
    payload: roundPlayedCardsSchema
  }),
  z.object({
    event: z.literal('room.black-card-drawn'),
    payload: blackCard
  })
]);

export type RoomEvent = z.infer<typeof roomEvent>;
