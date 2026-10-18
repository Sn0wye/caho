import { z } from 'zod';
import { roomListingSchema } from '@/schemas';

export const listRoomsResponse = z.array(roomListingSchema);

export type ListRoomsResponse = z.infer<typeof listRoomsResponse>;
