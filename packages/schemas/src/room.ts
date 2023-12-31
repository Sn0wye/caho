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
  password: z.string().or(z.null()),
  isPublic: z.coerce.boolean()
});

export type Room = z.infer<typeof roomSchema>;

export type RoomStatus = Room['status'];
