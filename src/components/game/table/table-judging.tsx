'use client';

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type PointerEvent
} from 'react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';
import type { useJudgePick } from '../round/use-judge-pick';
import { feltCardAt, layoutFeltCards, pointOnCard } from './felt-cards';
import type { TableSeat } from './table-seats';
import { useTableView } from './table-view';
import { useCursorPin } from './use-cursor-broadcast';

// The black card's natural size at size "sm" (h-72 × w-48), scaled to fit.
const CARD_WIDTH = 192;

// A hovered card tilts this share of the table's tilt back toward the camera,
// so it's easier to read, and rises clear of the felt.
const FLATTEN = 0.6;
const CLEARANCE_PX = 8;

type JudgingFeltProps = {
  judge: ReturnType<typeof useJudgePick>;
  seats: TableSeat[];
};

/**
 * Every answer face up on the felt, laid out in table space facing the Judge,
 * so the cards and the Judge's cursor line up on every screen. The card under
 * the Judge's cursor glows in their colour for everyone; the card under this
 * Player's own pointer tilts up toward them.
 *
 * @example
 * <JudgingFelt judge={useJudgePick()} seats={seats} />
 */
export function JudgingFelt({ judge, seats }: JudgingFeltProps) {
  const {
    round,
    isJudge,
    answers,
    chosenPlayerId,
    setChosenPlayerId,
    isPending
  } = judge;
  const { judgeId, cursors } = useGame();
  const { radius, spinDeg, tiltDeg } = useTableView();
  const pin = useCursorPin();
  const [hovered, setHovered] = useState<number | null>(null);

  const judgeSeat = seats.find(seat => seat.player.id === judgeId);
  const cards = useMemo(
    () => layoutFeltCards(answers.length, judgeSeat?.facingDeg ?? 0),
    [answers.length, judgeSeat?.facingDeg]
  );

  const judgeCursor = useSyncExternalStore(
    cursors.subscribe,
    () => (judgeId ? cursors.snapshot().get(judgeId) : undefined),
    () => undefined
  );
  const judgeHovered =
    !isJudge && judgeCursor ? feltCardAt(cards, judgeCursor) : null;

  // The card's own coordinates under the pointer, mapped back onto the table,
  // so the cursor others see sits on the same word even while this card is
  // tilted up on this screen. The card's content ignores the pointer, so the
  // offsets are always relative to the card itself.
  const pointAt = useCallback(
    (index: number, event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'touch') return;
      const button = event.currentTarget;
      const u = event.nativeEvent.offsetX / button.clientWidth;
      const v = event.nativeEvent.offsetY / button.clientHeight;
      setHovered(index);
      pin(pointOnCard(cards[index], clamp01(u), clamp01(v)));
    },
    [cards, pin]
  );

  const leave = useCallback(() => {
    setHovered(null);
    pin(null);
  }, [pin]);

  if (!round) return null;
  const canPick = isJudge && !isPending;

  return answers.map((answer, index) => {
    const card = cards[index];
    const width = card.width * radius;
    const height = card.height * radius;
    const scale = width / CARD_WIDTH;
    const isChosen = chosenPlayerId === answer.player.id;
    const isHovered = hovered === index;
    const isJudgeHovered = judgeHovered === index;
    // Tilt about this screen's horizontal axis: undo the spin, tilt, redo it.
    // It turns about its centre, so lift it by half its height's dip, or its
    // near half would sink into the felt.
    const flattenDeg = tiltDeg * FLATTEN;
    const lift =
      (height / 2) * Math.sin((flattenDeg * Math.PI) / 180) + CLEARANCE_PX;
    const tilt = isHovered
      ? ` translateZ(${lift}px) rotate(${-spinDeg}deg) rotateX(${-flattenDeg}deg) rotate(${spinDeg}deg)`
      : '';

    return (
      <div
        key={answer.id}
        className={cn(
          'absolute top-1/2 left-1/2 h-0 w-0 transition-transform duration-150 ease-out',
          isHovered && 'z-10'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate(${card.center.x * radius}px, ${card.center.y * radius}px)${tilt} rotate(${card.turnDeg}deg)`
        }}
      >
        <button
          type="button"
          // Not `disabled`: a disabled button gets no pointer events, and
          // everyone may hover the answers.
          aria-disabled={!canPick}
          onClick={() => {
            if (canPick) setChosenPlayerId(answer.player.id);
          }}
          onPointerMove={event => pointAt(index, event)}
          onPointerEnter={event => pointAt(index, event)}
          onPointerLeave={leave}
          aria-pressed={isChosen}
          aria-label={`Resposta ${index + 1}`}
          data-testid="felt-answer"
          data-judge-hover={isJudgeHovered || undefined}
          className={cn(
            'absolute rounded-xl transition-shadow',
            canPick ? 'cursor-pointer' : 'cursor-default',
            isChosen && 'ring-4 ring-orange-400'
          )}
          style={{
            left: -width / 2,
            top: -height / 2,
            width,
            height,
            boxShadow: isJudgeHovered
              ? `0 0 0 3px ${judgeSeat?.color}, 0 0 22px 4px ${judgeSeat?.color}`
              : undefined
          }}
        >
          <div
            className="pointer-events-none"
            style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}
          >
            <BlackCard
              size="sm"
              card={round.blackCard}
              answers={answer.whiteCards}
              className={cn(
                isHovered
                  ? 'shadow-[0_24px_36px_rgba(0,0,0,0.6)]'
                  : 'shadow-[0_12px_20px_rgba(0,0,0,0.5)]'
              )}
            />
          </div>
        </button>
      </div>
    );
  });
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
