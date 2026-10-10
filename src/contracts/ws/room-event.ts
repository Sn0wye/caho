import { z } from 'zod';
import {
  blackCard,
  rankingSchema,
  roomPlayerSchema,
  roundPlayedCardsSchema,
  sanitizedRoomSchema
} from '@/schemas';

// Mirrors the backend's `src/contracts/ws/room-event.ts`. See the backend's
// `docs/ws-events.md` for how each event patches client state.
export const roomEvent = z.union([
  z.object({
    event: z.literal('room.started'),
    payload: z.object({
      room: sanitizedRoomSchema,
      players: z.array(roomPlayerSchema)
    })
  }),
  z.object({
    event: z.literal('room.player-joined'),
    payload: roomPlayerSchema
  }),
  z.object({
    event: z.literal('room.player-left'),
    payload: z.object({
      id: z.string()
    })
  }),
  z.object({
    event: z.literal('room.player-update'),
    payload: roomPlayerSchema
  }),
  z.object({
    event: z.literal('room.round-start'),
    payload: z.object({
      roundNumber: z.number().int(),
      judgeId: z.string(),
      blackCard: blackCard
    })
  }),
  z.object({
    event: z.literal('room.time-to-judge'),
    payload: z.object({
      roundNumber: z.number().int(),
      roundPlayedCards: z.array(roundPlayedCardsSchema)
    })
  }),
  z.object({
    event: z.literal('room.round-end'),
    payload: z.object({
      roundNumber: z.number().int(),
      winner: roundPlayedCardsSchema.nullable(),
      winnerId: z.string().nullable(),
      newScore: z.number().int().nullable(),
      reason: z.enum(['picked', 'aborted'])
    })
  }),
  z.object({
    event: z.literal('room.game-end'),
    payload: rankingSchema
  })
]);

export type RoomEvent = z.infer<typeof roomEvent>;
