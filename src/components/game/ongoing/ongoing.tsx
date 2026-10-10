'use client';

import { CardsLoader } from '@/components/illustrations/cards-loader';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';
import { GamePlayerDeck } from '../game-player-deck';
import { GameRankingSidebar } from '../ranking/game-ranking-sidebar';
import { GameJudging } from '../round/game-judging';
import { GameRoundHeader } from '../round/game-round-header';

export const Ongoing = () => {
  const { round, selectedCards, playedCards, unselectCard, hasPlayed } =
    useGame();

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
      <GameRankingSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <GameRoundHeader />

        {!round && <ShufflingCards />}

        {round?.status === 'JUDGING' && <GameJudging />}

        {round && round.status !== 'JUDGING' && (
          <>
            <div className="flex flex-1 items-center justify-center p-8">
              <BlackCard
                card={round.blackCard}
                answers={hasPlayed ? playedCards : selectedCards}
                onAnswerClick={hasPlayed ? undefined : unselectCard}
              />
            </div>

            <GamePlayerDeck />
          </>
        )}
      </div>
    </main>
  );
};

function ShufflingCards() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <CardsLoader />
      <span className="text-zinc-500">Embaralhando as cartas...</span>
    </div>
  );
}
