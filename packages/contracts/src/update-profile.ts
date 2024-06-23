import { userSchema } from '@caho/schemas';
import { z } from 'zod';

export const updateProfileRequest = z.object({
  avatarUrl: z.string().nullable(),
  email: z.string().min(1),
  username: z.string().min(1)
});

export const updateProfileResponse = userSchema.omit({ password: true });
