import { z } from 'zod';

// Mirrors the backend's `src/contracts/ws/cursor.ts` (ADR-0006). Table space:
// the table's centre is (0, 0) and its rim sits at radius 1, the same on every
// screen whichever seat it draws at the bottom. `card` is the slot of the
// sender's own Hand the pointer rests on: an index only, so the others can lift
// that face-down card without ever seeing it.
export const cursorPosition = z.object({
  x: z.number().min(-2).max(2),
  y: z.number().min(-2).max(2),
  card: z.number().int().min(0).nullable().optional()
});

export type CursorPosition = z.infer<typeof cursorPosition>;

// The only messages the client sends on the Room socket.
export type CursorMessage =
  | { event: 'cursor.move'; payload: CursorPosition }
  | { event: 'cursor.hide' };
