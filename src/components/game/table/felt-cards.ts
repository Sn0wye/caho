import type { CursorPosition } from '@/contracts';

// A card lying on the felt, in table space: every client lays it out the same,
// so a cursor over it lands on the same card, and the same spot of its text,
// on every screen.
export type FeltCard = {
  center: CursorPosition;
  // Table units; multiply by the radius for px.
  width: number;
  height: number;
  // Which way the card reads, like FeltAnchor's turnDeg.
  turnDeg: number;
};

// Card aspect (w-48 × h-72) and the gap between cards, as a fraction of width.
const CARD_ASPECT = 1.5;
const GAP = 0.14;

// Columns and card width per answer count, sized to stay inside the Hands on
// the felt (they start at ~0.74 from the centre).
function gridFor(count: number): { columns: number; width: number } {
  if (count <= 3) return { columns: Math.max(count, 1), width: 0.36 };
  if (count <= 6) return { columns: 3, width: 0.28 };
  if (count <= 9) return { columns: 3, width: 0.22 };
  return { columns: 4, width: 0.2 };
}

/**
 * Lays `count` cards in a centred grid on the felt, reading upright from the
 * seat whose facing is `turnDeg` (e.g. the Judge's).
 *
 * @example
 * layoutFeltCards(3, judgeSeat.facingDeg); // one row of three, facing the Judge
 */
export function layoutFeltCards(count: number, turnDeg: number): FeltCard[] {
  const { columns, width } = gridFor(count);
  const height = width * CARD_ASPECT;
  const gap = width * GAP;
  const rows = Math.ceil(count / columns);
  const angle = (turnDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns);
    // The last row may be short; centre it.
    const inRow = Math.min(columns, count - row * columns);
    const column = index - row * columns;
    // In the reader's frame: +x to their right, +y toward them.
    const x = (column - (inRow - 1) / 2) * (width + gap);
    const y = (row - (rows - 1) / 2) * (height + gap);
    return {
      center: { x: x * cos - y * sin, y: x * sin + y * cos },
      width,
      height,
      turnDeg
    };
  });
}

/**
 * The table-space point at (`u`, `v`) across a card, both 0–1 from its
 * top-left as its reader sees it.
 *
 * @example
 * pointOnCard(card, 0.5, 0.5); // card.center
 */
export function pointOnCard(
  card: FeltCard,
  u: number,
  v: number
): CursorPosition {
  const angle = (card.turnDeg * Math.PI) / 180;
  const x = (u - 0.5) * card.width;
  const y = (v - 0.5) * card.height;
  return {
    x: card.center.x + x * Math.cos(angle) - y * Math.sin(angle),
    y: card.center.y + x * Math.sin(angle) + y * Math.cos(angle)
  };
}

/**
 * Index of the card under a table-space point, or null.
 *
 * @example
 * feltCardAt(cards, judgeCursor); // 2: the Judge points at the third answer
 */
export function feltCardAt(
  cards: FeltCard[],
  point: CursorPosition
): number | null {
  const index = cards.findIndex(card => {
    const angle = (-card.turnDeg * Math.PI) / 180;
    const dx = point.x - card.center.x;
    const dy = point.y - card.center.y;
    const x = dx * Math.cos(angle) - dy * Math.sin(angle);
    const y = dx * Math.sin(angle) + dy * Math.cos(angle);
    return Math.abs(x) <= card.width / 2 && Math.abs(y) <= card.height / 2;
  });
  return index < 0 ? null : index;
}
