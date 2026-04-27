import type { z } from 'zod';
import { userSchema } from '@/schemas';

export const getProfileResponse = userSchema.omit({ password: true });

export type GetProfileResponse = z.infer<typeof getProfileResponse>;
