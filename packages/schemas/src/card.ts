import { z } from 'zod';

export const blackCard = z.object({
  text: z.string(),
  packId: z.string(),
  pick: z.number()
});
export type BlackCard = z.infer<typeof blackCard>;

export const whiteCard = z.object({
  id: z.string(),
  text: z.string(),
  packId: z.string()
});
export type WhiteCard = z.infer<typeof whiteCard>;

export const cardSchema = z.union([blackCard, whiteCard]);
