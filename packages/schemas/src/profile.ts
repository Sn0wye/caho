import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  username: z.string(),
  avatarUrl: z.string().nullable()
});

export type Profile = z.infer<typeof profileSchema>;
export type User = z.infer<typeof profileSchema>;
