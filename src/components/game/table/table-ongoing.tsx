'use client';

import { Check, Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';
import { GamePlayerDeck } from '../game-player-deck';
import { GameRoundHeader } from '../round/game-round-header';
import { useJudgePick } from '../round/use-judge-pick';
import { GameTable } from './game-table';
import type { TableSeat } from './table-seats';
import { FeltAnchor } from './table-view';

// The black card is h-72 × w-48 at size "sm"; scaled to fit the felt.
const CARD_WIDTH = 192;
const CARD_HEIGHT = 288;

type JudgePick = ReturnType<typeof useJudgePick>;

export function TableOngoing() {
  const { round, judgeId } = useGame();
  // One pick shared by the cards on the felt and the confirm button.
  const judge = useJudgePick();
  const isJudging = round?.status === 'JUDGING';

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1 flex-col">
      <GameRoundHeader />
      <GameTable
        felt={seats => (
          <>
            {!isJudging && <PlayedCardBacks seats={seats} />}
            {isJudging ? <JudgingFelt judge={judge} /> : <RoundFelt />}
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
      />
    </main>
  );
}

// The Black Card in the middle, with this Player's picks filled in.
function RoundFelt() {
  const { round, hasPlayed, playedCards, selectedCards, unselectCard } =
    useGame();

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
      <BlackCard
        size="sm"
        card={round.blackCard}
        answers={hasPlayed ? playedCards : selectedCards}
        onAnswerClick={hasPlayed ? undefined : unselectCard}
        className="shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
      />
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

// Every answer revealed face-up on the felt; the Judge clicks one.
function JudgingFelt({ judge }: { judge: JudgePick }) {
  const {
    round,
    isJudge,
    answers,
    chosenPlayerId,
    setChosenPlayerId,
    isPending
  } = judge;
  if (!round) return null;

  const scale = answers.length <= 3 ? 0.72 : answers.length <= 6 ? 0.56 : 0.45;

  return (
    <FeltAnchor position={{ x: 0, y: 0 }}>
      <div className="flex w-[34rem] flex-wrap items-center justify-center gap-3">
        {answers.map((answer, index) => {
          const isChosen = chosenPlayerId === answer.player.id;
          return (
            <button
              key={answer.id}
              type="button"
              disabled={!isJudge || isPending}
              onClick={() => setChosenPlayerId(answer.player.id)}
              aria-pressed={isChosen}
              aria-label={`Resposta ${index + 1}`}
              className={cn(
                'rounded-xl transition-transform',
                isJudge && 'hover:-translate-y-2 hover:cursor-pointer',
                isChosen && 'ring-4 ring-orange-400'
              )}
              style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}
            >
              <div
                style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}
              >
                <BlackCard
                  size="sm"
                  card={round.blackCard}
                  answers={answer.whiteCards}
                  className="shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
            </button>
          );
        })}
      </div>
    </FeltAnchor>
  );
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
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 h-72 translate-y-10">
      <GamePlayerDeck />
    </div>
  );
}
