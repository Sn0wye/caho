'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import {
  HAND_CARD_HEIGHT,
  HAND_CARD_STEP,
  HAND_CARD_WIDTH,
  type TableSeat
} from './table-seats';
import { FeltAnchor, useTableView } from './table-view';

const NO_CURSORS = new Map();

// Lets this Player's own Hand (an overlay, not on the felt) tell the table
// which card the pointer rests on. Null outside a table with Hands.
const HandHoverContext = createContext<((card: number | null) => void) | null>(
  null
);

export const HandHoverProvider = HandHoverContext.Provider;

/**
 * Reports which card of this Player's Hand the pointer rests on, so the others
 * see that face-down card lift on the table. A no-op outside the table layout.
 *
 * @example
 * const hoverCard = useHandHover();
 * <WhiteCard onHoverChange={hovered => hoverCard(hovered ? index : null)} />
 */
export function useHandHover(): (card: number | null) => void {
  return useContext(HandHoverContext) ?? noop;
}

function noop() {}

type TableHandsProps = {
  seats: TableSeat[];
  selfId: string | undefined;
  handSize: (seat: TableSeat) => number;
};

/**
 * Every other Player's Hand lying face down on the felt in front of their seat,
 * like real cards only their owner can read. The card under a Player's pointer
 * lifts, outlined in their colour.
 *
 * @example
 * <TableHands seats={seats} selfId={userId} handSize={() => 10} />
 */
export function TableHands({ seats, selfId, handSize }: TableHandsProps) {
  const { cursors } = useGame();
  const positions = useSyncExternalStore(
    cursors.subscribe,
    cursors.snapshot,
    () => NO_CURSORS
  );

  return seats
    .filter(seat => seat.player.id !== selfId)
    .map(seat => (
      <FaceDownHand
        key={seat.player.id}
        seat={seat}
        size={handSize(seat)}
        hovered={positions.get(seat.player.id)?.card ?? null}
      />
    ));
}

function FaceDownHand({
  seat,
  size,
  hovered
}: {
  seat: TableSeat;
  size: number;
  hovered: number | null;
}) {
  const { radius } = useTableView();
  if (size <= 0) return null;

  const width = HAND_CARD_WIDTH * radius;
  const height = HAND_CARD_HEIGHT * radius;
  const step = HAND_CARD_STEP * radius;
  // A Hand can shrink under a stale hover, e.g. right after playing.
  const lifted = hovered === null ? null : Math.min(hovered, size - 1);
  const middle = (size - 1) / 2;

  return (
    <FeltAnchor position={seat.handPosition} turnDeg={seat.facingDeg}>
      <div
        data-testid="table-hand"
        data-player={seat.player.username}
        className="relative"
        style={{ width: width + step * (size - 1), height }}
      >
        {Array.from({ length: size }, (_, slot) => {
          const isLifted = slot === lifted;
          return (
            <div
              key={slot}
              data-lifted={isLifted || undefined}
              className={cn(
                'absolute top-0 flex items-center justify-center rounded-[3px] border border-zinc-300 bg-white font-black tracking-tight text-zinc-950 shadow-[0_3px_5px_rgba(0,0,0,0.45)] transition-transform duration-150 ease-out',
                isLifted && 'z-10'
              )}
              style={{
                left: slot * step,
                width,
                height,
                fontSize: Math.max(5, width * 0.2),
                transformOrigin: '50% 100%',
                // A slight fan, like cards held loosely; the hovered card
                // rises toward the centre of the table.
                transform: `rotate(${(slot - middle) * 2.5}deg)${
                  isLifted ? ` translateY(${-height * 0.4}px) scale(1.12)` : ''
                }`,
                boxShadow: isLifted
                  ? `0 0 0 2px ${seat.color}, 0 0 14px 2px ${seat.color}, 0 8px 12px rgba(0,0,0,0.5)`
                  : undefined
              }}
            >
              CAHO
            </div>
          );
        })}
      </div>
    </FeltAnchor>
  );
}
