import { z } from 'zod';

export const blackCard = z.object({
  text: z.string(),
  packId: z.string(),
  pick: z.number()
});
export const whiteCard = z.object({
  text: z.string(),
  packId: z.string()
});

export const cardSchema = z.union([blackCard, whiteCard]);
