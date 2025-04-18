'use client';

import { useGame } from '@/hooks/game';
import { WhiteCard } from './cards/white-card';

export function GamePlayerDeck() {
  // TODO: -space-x-10 group hover:space-x-8 stack arc */
  const { currentWhiteCards, currentPlayer } = useGame();

  const isJudge = currentPlayer.isJudge;

  console.log(currentPlayer);

  if (isJudge) {
    return (
      <div>
        <span>Como já esperado, Juiz não trabalha no Brasil...</span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center space-x-4">
      {currentWhiteCards.map(card => (
        <WhiteCard key={card.id} data={card} />
      ))}
    </div>
  );
}
