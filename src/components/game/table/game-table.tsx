'use client';

import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { TableCursors } from './table-cursors';
import type { TableView } from './table-geometry';
import { HandHoverProvider, TableHands } from './table-hands';
import { TableSeatMarker } from './table-seat-marker';
import { arrangeSeats, handSlotPosition, type TableSeat } from './table-seats';
import { TableViewProvider } from './table-view';
import { useCursorBroadcast } from './use-cursor-broadcast';
import { useElementSize } from './use-element-size';

// The table's centre sits a bit above the scene's middle, leaving the bottom
// for this Player's hand.
const CENTER_Y = 0.42;
const TILT_DEG = 52;
// Thickness of the table top, px; its edge shows on the near side.
const TABLE_DEPTH = 22;
const MIN_RADIUS = 160;
const MAX_RADIUS = 440;

type GameTableProps = {
  // Lies flat on the felt (cards, the centre piece).
  felt: (seats: TableSeat[]) => ReactNode;
  // What each seat shows under the Player's name.
  seatStatus: (seat: TableSeat) => ReactNode;
  // Drawn over the scene, e.g. the hand or the lobby buttons.
  overlay?: ReactNode;
  // How many cards each Player holds. When set, the others' Hands lie face
  // down in front of their seats, and hovering a card of this Player's Hand
  // lifts it on everyone else's table.
  handSize?: (seat: TableSeat) => number;
  className?: string;
};

/**
 * The 2.5D table: every Player seated around one tilted table, this Player at
 * the bottom, with everyone else's cursor live on it (backend ADR-0006).
 *
 * @example
 * <GameTable felt={() => <BlackCard card={card} />} seatStatus={() => null} />
 */
export function GameTable({
  felt,
  seatStatus,
  overlay,
  handSize,
  className
}: GameTableProps) {
  const { players, currentPlayer, sendCursor } = useGame();
  const sceneRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(sceneRef);

  const { seats, spinDeg } = useMemo(
    () => arrangeSeats(players, currentPlayer?.id ?? null),
    [players, currentPlayer?.id]
  );

  const view = useMemo<TableView>(() => {
    const radius = Math.min(
      MAX_RADIUS,
      Math.max(MIN_RADIUS, Math.min(width * 0.3, height * 0.46))
    );
    return { radius, perspective: radius * 2.4, tiltDeg: TILT_DEG, spinDeg };
  }, [width, height, spinDeg]);

  const pointer = useCursorBroadcast({
    sceneRef,
    centerY: CENTER_Y,
    view,
    send: sendCursor
  });

  const selfSeat = seats.find(seat => seat.player.id === currentPlayer?.id);
  const { hoverCard } = pointer;
  const hoverHandCard = useCallback(
    (card: number | null) => {
      if (card === null || !selfSeat || !handSize) {
        hoverCard(null);
        return;
      }
      const size = handSize(selfSeat);
      if (size <= 0) return;
      const slot = Math.min(card, size - 1);
      hoverCard(slot, handSlotPosition(selfSeat, slot, size));
    },
    [hoverCard, selfSeat, handSize]
  );

  return (
    <TableViewProvider value={view}>
      <div
        ref={sceneRef}
        data-testid="game-table"
        onPointerMove={pointer.onPointerMove}
        onPointerLeave={pointer.onPointerLeave}
        className={cn(
          'relative min-h-0 flex-1 overflow-clip bg-[radial-gradient(ellipse_at_50%_35%,var(--color-zinc-100),var(--color-zinc-300))] dark:bg-[radial-gradient(ellipse_at_50%_35%,var(--color-zinc-900),var(--color-zinc-950)_70%)]',
          className
        )}
      >
        {width > 0 && (
          <>
            <div
              className="absolute inset-0"
              style={{
                perspective: `${view.perspective}px`,
                perspectiveOrigin: `50% ${CENTER_Y * 100}%`
              }}
            >
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: `${CENTER_Y * 100}%`,
                  width: view.radius * 2,
                  height: view.radius * 2,
                  transform: `translate(-50%, -50%) rotateX(${view.tiltDeg}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <TableEdge />
                <TableFelt />
                <div
                  className="absolute inset-0"
                  style={{ transform: `rotateZ(${view.spinDeg}deg)` }}
                >
                  {handSize && (
                    <TableHands
                      seats={seats}
                      selfId={currentPlayer?.id}
                      handSize={handSize}
                    />
                  )}
                  {felt(seats)}
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute left-1/2 z-10"
              style={{ top: `${CENTER_Y * 100}%` }}
            >
              {/* This Player is the camera, so only the others get a seat. */}
              {seats
                .filter(seat => seat.player.id !== currentPlayer?.id)
                .map(seat => (
                  <TableSeatMarker key={seat.player.id} seat={seat}>
                    {seatStatus(seat)}
                  </TableSeatMarker>
                ))}
            </div>
          </>
        )}

        <HandHoverProvider value={hoverHandCard}>{overlay}</HandHoverProvider>

        {width > 0 && (
          <div
            className="pointer-events-none absolute left-1/2 z-40"
            style={{ top: `${CENTER_Y * 100}%` }}
          >
            <TableCursors seats={seats} handSize={handSize} />
          </div>
        )}
      </div>
    </TableViewProvider>
  );
}

// Stacked discs under the top give it a visible wooden edge.
function TableEdge() {
  return [1, 0.66, 0.33].map(step => (
    <div
      key={step}
      className="absolute inset-0 rounded-full bg-[#2a170b]"
      style={{ transform: `translateZ(${-TABLE_DEPTH * step}px)` }}
    />
  ));
}

// Wood rim around green felt, lit from the top like a lamp over the table.
function TableFelt() {
  return (
    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#5b3a21,#8a5a33,#5b3a21,#3f2716,#5b3a21)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
      <div className="absolute inset-[3.5%] rounded-full bg-[radial-gradient(circle_at_50%_40%,#2f7a52,#1b5137_55%,#0f3322)] shadow-[inset_0_0_60px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-[18%] rounded-full border border-dashed border-white/10" />
      </div>
    </div>
  );
}
