import { z } from 'zod';
import { playerSchema } from '..';

export const wsServerEventSchema = z.union([
  z.object({
    type: z.literal('player-joined'),
    payload: playerSchema
  }),
  z.object({
    type: z.literal('player-left'),
    payload: playerSchema
  }),
  z.object({
    type: z.literal('player-ready'),
    payload: playerSchema
  }),
  z.object({
    type: z.literal('game-started'),
    payload: z.null()
  }),
  z.object({
    type: z.literal('game-ended'),
    payload: z.null()
  })
]);

export type WsServerEvent = z.infer<typeof wsServerEventSchema>;
