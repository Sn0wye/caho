import { userSchema } from '@caho/schemas';
import { z } from 'zod';

export const signUpRequest = z.object({
  username: z.string().min(1),
  password: z.string().min(8)
});

export type SignUpRequest = z.infer<typeof signUpRequest>;

export const signUpResponse = userSchema.omit({ password: true });

export type SignUpResponse = z.infer<typeof signUpResponse>;
