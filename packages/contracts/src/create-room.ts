import { roomSchema } from '@caho/schemas';
import { type z } from 'zod';

export const createRoom = roomSchema.omit({
  id: true,
  status: true,
  code: true
});

export type CreateRoom = z.infer<typeof createRoom>;
