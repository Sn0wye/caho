'use client';

import { useSyncExternalStore } from 'react';
import type { CursorPosition } from '@/contracts';
import { useGame } from '@/hooks/game';
import { handSlotPosition, type TableSeat } from './table-seats';
import { StandingAnchor } from './table-view';

const NO_CURSORS = new Map();

// Other Players' pointers, drawn where they point on the table. Positions
// arrive ~20 times a second; the transition smooths the gaps between them. A
// cursor resting on a card of its Player's Hand points at that card as this
// client lays the Hand out, so it lines up with the lifted card.
export function TableCursors({
  seats,
  handSize,
  cursorHeight
}: {
  seats: TableSeat[];
  handSize?: (seat: TableSeat) => number;
  cursorHeight?: (playerId: string, point: CursorPosition) => number;
}) {
  const { cursors } = useGame();
  const positions = useSyncExternalStore(
    cursors.subscribe,
    cursors.snapshot,
    () => NO_CURSORS
  );

  return seats.map(seat => {
    const { player, color } = seat;
    const cursor = positions.get(player.id);
    if (!cursor) return null;
    const size = handSize?.(seat) ?? 0;
    const position =
      cursor.card != null && size > 0
        ? handSlotPosition(seat, Math.min(cursor.card, size - 1), size)
        : cursor;

    return (
      <StandingAnchor
        key={player.id}
        position={position}
        height={cursorHeight?.(player.id, position) ?? 0}
        className="pointer-events-none transition-transform duration-100 ease-linear"
      >
        <div
          className="flex flex-col items-start"
          data-testid="table-cursor"
          data-player={player.username}
        >
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            className="-mt-[2px] -ml-[3px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
            aria-hidden
          >
            <path
              d="M3 2 L19 13 L11.5 14 L8 22 Z"
              fill={color}
              stroke="#09090b"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="-mt-1 ml-3 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-zinc-950 shadow-md"
            style={{ backgroundColor: color }}
          >
            {player.username}
          </span>
        </div>
      </StandingAnchor>
    );
  });
}
