'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';
import { GamePlayerDeck } from '../game-player-deck';
import { GameRoundHeader } from '../round/game-round-header';
import { useJudgePick } from '../round/use-judge-pick';
import { GameTable } from './game-table';
import {
  previewSide,
  useCardPreview,
  type CardPreview
} from './table-card-preview';
import { useHandHover } from './table-hands';
import {
  answerCursorHeight,
  JudgingFelt,
  useAnswerCards
} from './table-judging';
import type { TableSeat } from './table-seats';
import { FeltAnchor } from './table-view';

// Mirrors the backend's HAND_SIZE (services/room/gameRules.ts).
const HAND_SIZE = 10;

type JudgePick = ReturnType<typeof useJudgePick>;

export function TableOngoing() {
  const { round, judgeId } = useGame();
  // One pick shared by the cards on the felt and the confirm button.
  const judge = useJudgePick();
  const isJudging = round?.status === 'JUDGING';
  const pick = round?.blackCard?.pick ?? 0;
  const answerCards = useAnswerCards(judge.answers.length);

  // Players don't share their Hands' sizes, so derive them: a full Hand, less
  // the cards played this Round until the refill.
  const handSize = useCallback(
    ({ player }: TableSeat) => {
      if (!round) return 0;
      const hasPlayed = player.isReady && player.id !== judgeId;
      return HAND_SIZE - (hasPlayed ? pick : 0);
    },
    [round, judgeId, pick]
  );

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1 flex-col">
      <GameRoundHeader />
      <GameTable
        felt={seats => (
          <>
            {!isJudging && <PlayedCardBacks seats={seats} />}
            {isJudging ? (
              <JudgingFelt judge={judge} cards={answerCards} />
            ) : (
              <RoundFelt />
            )}
          </>
        )}
        seatStatus={({ player }) => {
          if (player.id === judgeId)
            return (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-500">
                <Gavel size={12} /> juiz
              </span>
            );
          if (isJudging || !round) return null;
          return player.isReady ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-500">
              <Check size={12} /> jogou
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">pensando...</span>
          );
        }}
        overlay={isJudging ? <JudgingBar judge={judge} /> : <TableHand />}
        handSize={handSize}
        cursorHeight={
          isJudging ? answerCursorHeight(answerCards, judgeId) : undefined
        }
      />
    </main>
  );
}

// The Black Card in the middle, with this Player's picks filled in.
function RoundFelt() {
  const { round, hasPlayed, playedCards, selectedCards, unselectCard } =
    useGame();
  const preview = useCardPreview();
  const [hoverSide, setHoverSide] = useState<CardPreview['side'] | null>(null);
  const answers = hasPlayed ? playedCards : selectedCards;

  // Zoomed beside the table while hovered, following picks as they change.
  useEffect(() => {
    preview(
      hoverSide && round
        ? { card: round.blackCard, answers, side: hoverSide }
        : null
    );
  }, [preview, hoverSide, round, answers]);

  useEffect(() => () => preview(null), [preview]);

  if (!round) {
    return (
      <FeltAnchor position={{ x: 0, y: 0 }}>
        <span className="text-lg font-semibold text-white/70">
          Embaralhando as cartas...
        </span>
      </FeltAnchor>
    );
  }

  return (
    <FeltAnchor position={{ x: 0, y: -0.05 }}>
      <div
        data-testid="felt-black-card"
        // Move too: a card under a resting pointer gets no pointerenter.
        onPointerMove={event => {
          if (event.pointerType === 'touch' || hoverSide) return;
          setHoverSide(previewSide(event.clientX));
        }}
        onPointerLeave={() => setHoverSide(null)}
      >
        <BlackCard
          size="sm"
          card={round.blackCard}
          answers={answers}
          onAnswerClick={hasPlayed ? undefined : unselectCard}
          className="shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
        />
      </div>
    </FeltAnchor>
  );
}

// A face-down card in front of each Player who already played.
function PlayedCardBacks({ seats }: { seats: TableSeat[] }) {
  const { round, judgeId } = useGame();
  if (round?.status !== 'PLAYING') return null;

  return seats
    .filter(({ player }) => player.isReady && player.id !== judgeId)
    .map(seat => (
      <FeltAnchor
        key={seat.player.id}
        position={seat.cardPosition}
        turnDeg={seat.facingDeg}
      >
        <div
          data-testid="played-card-back"
          className="animate-in fade-in zoom-in-50 flex h-[4.5rem] w-12 items-center justify-center rounded-md border-2 border-zinc-200 bg-white text-[8px] font-black tracking-tight text-zinc-950 shadow-[0_6px_10px_rgba(0,0,0,0.45)] duration-300"
        >
          CAHO
        </div>
      </FeltAnchor>
    ));
}

function JudgingBar({ judge }: { judge: JudgePick }) {
  const { isJudge, chosenPlayerId, confirmWinner, isPending } = judge;

  return (
    <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 text-center">
      <span className="rounded-full bg-zinc-950/80 px-4 py-1.5 text-sm text-zinc-200">
        {isJudge
          ? 'Clique na pior atrocidade da mesa.'
          : 'O juiz está deliberando... As cartas estão na mesa.'}
      </span>
      {isJudge && chosenPlayerId && (
        <Button
          onClick={() => confirmWinner(chosenPlayerId)}
          disabled={isPending}
          className="gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Essa é a pior!
        </Button>
      )}
    </div>
  );
}

// This Player's hand along the bottom edge, over the near side of the table.
function TableHand() {
  const hoverCard = useHandHover();

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 h-72 translate-y-10"
      onPointerLeave={() => hoverCard(null)}
    >
      <GamePlayerDeck onCardHover={hoverCard} />
    </div>
  );
}
