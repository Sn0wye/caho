import { z } from 'zod';

export const errorSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  message: z.string()
});

export type Error = z.infer<typeof errorSchema>;
