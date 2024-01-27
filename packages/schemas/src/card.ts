import { z } from 'zod';

const blackCard = z.object({
  text: z.string(),
  packId: z.string(),
  pick: z.number()
});
const whiteCard = z.object({
  text: z.string(),
  packId: z.string()
});

export const cardSchema = z.union([blackCard, whiteCard]);
