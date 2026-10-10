import { z } from 'zod';
import { userSchema } from '@/schemas';

export const updateProfileRequest = z.object({
  avatarUrl: z.string().url().nullable(),
  // Password accounts start without an email, so it stays optional.
  email: z.string().trim().email().nullable(),
  username: z.string().trim().min(1).max(255)
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequest>;

export const updateProfileResponse = userSchema.omit({ password: true });

export type UpdateProfileResponse = z.infer<typeof updateProfileResponse>;
