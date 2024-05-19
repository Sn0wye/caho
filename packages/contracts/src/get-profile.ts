import { userSchema } from '@caho/schemas';
import type { z } from 'zod';

export const getProfileResponse = userSchema.omit({ password: true });

export type GetProfileResponse = z.infer<typeof getProfileResponse>;
