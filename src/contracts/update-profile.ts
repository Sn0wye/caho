import { z } from 'zod';
import { userSchema } from '@/schemas';

export const updateProfileRequest = z.object({
  avatarUrl: z.string().nullable(),
  email: z.string().min(1),
  username: z.string().min(1)
});

export const updateProfileResponse = userSchema.omit({ password: true });
