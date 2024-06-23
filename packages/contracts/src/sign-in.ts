import { userSchema } from '@caho/schemas';
import { z } from 'zod';

export const signInRequest = z.object({
  username: z.string().min(1),
  password: z.string().min(8)
});

export type SignInRequest = z.infer<typeof signInRequest>;

export const signInResponse = userSchema.omit({ password: true }).extend({
  token: z.string().min(1)
});

export type SignInResponse = z.infer<typeof signInResponse>;
