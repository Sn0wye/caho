import { z } from 'zod';

export const wsClientEventSchema = z.union([
  z.object({
    type: z.literal('join-room'),
    payload: z.object({
      password: z.string().or(z.null())
    })
  }),
  z.object({
    type: z.literal('leave-room'),
    payload: z.null()
  }),
  z.object({
    type: z.literal('ready'),
    payload: z.object({
      ready: z.boolean()
    })
  }),
  z.object({
    type: z.literal('start-game'),
    payload: z.null()
  }),
  z.object({
    type: z.literal('end-game'),
    payload: z.null()
  }),
  z.object({
    type: z.literal('get-players'),
    payload: z.null()
  })
]);

export type WsClientEvent = z.infer<typeof wsClientEventSchema>;
