'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type PointerEvent
} from 'react';
import { cn } from '@/utils/cn';
import type { CursorPosition } from '@/contracts';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';
import type { useJudgePick } from '../round/use-judge-pick';
import {
  feltCardAt,
  layoutFeltCards,
  pointOnCard,
  type FeltCard
} from './felt-cards';
import {
  previewSide,
  useCardPreview,
  type CardPreview
} from './table-card-preview';
import { arrangeSeats } from './table-seats';
import { useTableView } from './table-view';
import { useCursorPin } from './use-cursor-broadcast';

// The black card's natural size at size "sm" (h-72 × w-48), scaled to fit.
const CARD_WIDTH = 192;

// How high the Judge lifts the answer under their cursor, in table units.
const ANSWER_LIFT = 0.09;

/**
 * The answers laid out on the felt, facing the Judge's seat. Derived from the
 * Room alone, so every client lays them out the same.
 *
 * @example
 * const cards = useAnswerCards(answers.length);
 */
export function useAnswerCards(count: number): FeltCard[] {
  const { players, judgeId } = useGame();
  const judgeFacing = useMemo(
    () =>
      arrangeSeats(players, null).seats.find(seat => seat.player.id === judgeId)
        ?.facingDeg ?? 0,
    [players, judgeId]
  );
  return useMemo(
    () => layoutFeltCards(count, judgeFacing),
    [count, judgeFacing]
  );
}

/**
 * How high the Judge's cursor floats at a point: over the answer they hold up,
 * at its height, so it stays on the card on every screen.
 *
 * @example
 * <GameTable cursorHeight={answerCursorHeight(cards, judgeId)} />
 */
export function answerCursorHeight(cards: FeltCard[], judgeId: string | null) {
  return (playerId: string, point: CursorPosition) =>
    playerId === judgeId && feltCardAt(cards, point) !== null ? ANSWER_LIFT : 0;
}

type JudgingFeltProps = {
  judge: ReturnType<typeof useJudgePick>;
  cards: FeltCard[];
};

/**
 * Every answer face up on the felt, laid out in table space facing the Judge,
 * so the cards and the Judge's cursor line up on every screen. The Judge lifts
 * the answer under their cursor, and everyone sees it rise. Any card under this
 * Player's own pointer shows upright and full size beside the table.
 *
 * @example
 * <JudgingFelt judge={useJudgePick()} cards={useAnswerCards(answers.length)} />
 */
export function JudgingFelt({ judge, cards }: JudgingFeltProps) {
  const {
    round,
    isJudge,
    answers,
    chosenPlayerId,
    setChosenPlayerId,
    isPending
  } = judge;
  const { judgeId, cursors, players } = useGame();
  const { radius } = useTableView();
  const pin = useCursorPin();
  const preview = useCardPreview();
  const [hovered, setHovered] = useState<{
    index: number;
    side: CardPreview['side'];
  } | null>(null);

  const judgeCursor = useSyncExternalStore(
    cursors.subscribe,
    () => (judgeId ? cursors.snapshot().get(judgeId) : undefined),
    () => undefined
  );
  const lifted = isJudge
    ? (hovered?.index ?? null)
    : judgeCursor
      ? feltCardAt(cards, judgeCursor)
      : null;
  const judgeColor = useMemo(
    () =>
      arrangeSeats(players, null).seats.find(seat => seat.player.id === judgeId)
        ?.color,
    [players, judgeId]
  );

  const hoveredAnswer = hovered ? answers[hovered.index] : undefined;
  useEffect(() => {
    preview(
      hoveredAnswer && hovered
        ? {
            card: round?.blackCard ?? null,
            answers: hoveredAnswer.whiteCards,
            side: hovered.side
          }
        : null
    );
  }, [preview, round?.blackCard, hoveredAnswer, hovered]);

  // Clear the zoomed card when judging ends under the pointer.
  useEffect(() => () => preview(null), [preview]);

  // The card's own coordinates under the pointer, mapped back onto the felt,
  // so the cursor the others see sits on the same word even while the card is
  // lifted. The card's content ignores the pointer, so the offsets are always
  // relative to the card itself.
  const pointAt = useCallback(
    (index: number, event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'touch') return;
      const button = event.currentTarget;
      const u = event.nativeEvent.offsetX / button.clientWidth;
      const v = event.nativeEvent.offsetY / button.clientHeight;
      const side = previewSide(event.clientX);
      setHovered(current =>
        current?.index === index ? current : { index, side }
      );
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
    const isLifted = lifted === index;
    const isHovered = hovered?.index === index;
    const place = `translate(${card.center.x * radius}px, ${card.center.y * radius}px)`;

    return (
      <Fragment key={answer.id}>
        {/* Stays on the felt while the card rises, selling the height. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-0 w-0"
          style={{ transform: `${place} rotate(${card.turnDeg}deg)` }}
        >
          <div
            className={cn(
              'absolute rounded-xl bg-black/60 blur-md transition-opacity duration-150',
              isLifted ? 'opacity-100' : 'opacity-0'
            )}
            style={{ left: -width / 2, top: -height / 2, width, height }}
          />
        </div>

        <div
          className={cn(
            'absolute top-1/2 left-1/2 h-0 w-0 transition-transform duration-150 ease-out',
            isLifted && 'z-10'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: `${place} translateZ(${isLifted ? ANSWER_LIFT * radius : 0}px) rotate(${card.turnDeg}deg)`
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
            data-lifted={isLifted || undefined}
            className={cn(
              'pointer-events-auto absolute rounded-xl transition-shadow',
              canPick ? 'cursor-pointer' : 'cursor-default',
              isChosen && 'ring-4 ring-orange-400',
              !isChosen && isHovered && 'ring-2 ring-white/50'
            )}
            style={{
              left: -width / 2,
              top: -height / 2,
              width,
              height,
              boxShadow:
                isLifted && !isJudge && judgeColor
                  ? `0 0 0 3px ${judgeColor}, 0 0 22px 4px ${judgeColor}`
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
                className="shadow-[0_8px_14px_rgba(0,0,0,0.45)]"
              />
            </div>
          </button>
        </div>
      </Fragment>
    );
  });
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
