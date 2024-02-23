import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  username: z.string(),
  password: z.string(),
  avatarUrl: z.string().nullable()
});

export type UserSchema = z.infer<typeof userSchema>;
