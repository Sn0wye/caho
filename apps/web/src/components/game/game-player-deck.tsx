'use client';

import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { Button } from '../ui/button';
import { WhiteCard } from './cards/white-card';

export function GamePlayerDeck() {
  const { currentWhiteCards, currentPlayer, isWhiteCardPickingDisabled } =
    useGame();
  const isJudge = currentPlayer.isJudge;

  currentWhiteCards.sort((a, b) => a.text.localeCompare(b.text));

  if (isJudge) {
    return (
      <div>
        <span>Como já esperado, Juiz não trabalha no Brasil...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-full max-h-96 w-full max-w-full snap-x snap-mandatory snap-always flex-row items-center justify-center -space-x-32 overflow-x-auto scroll-smooth hover:overflow-x-scroll'
      )}
    >
      {currentWhiteCards.map(card => (
        <WhiteCard key={card.id} data={card} />
      ))}

      <div
        className={cn(
          'absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 overflow-clip backdrop-blur-sm before:absolute before:bottom-0 before:-z-10 before:aspect-square before:h-1/2 before:translate-y-1/2 before:rounded-full before:bg-zinc-950 before:blur-[120px] after:absolute after:inset-0 after:-z-20 after:bg-gradient-to-b after:from-white after:to-white/10 after:content-[""] before:dark:bg-zinc-400 after:dark:from-zinc-950  after:dark:to-zinc-950/90',
          !isWhiteCardPickingDisabled && 'hidden'
        )}
      >
        <header className="flex max-w-xs flex-col items-center justify-center gap-1 text-center ">
          <h3 className="text-2xl font-bold">Escolheu sua atrocidade?</h3>
          <span className="text-balance text-sm text-zinc-700 dark:text-zinc-300">
            Para desfazer uma carta jogada, basta clicar no texto dela na carta
            preta e ela retornará ao baralho
          </span>
        </header>

        <Button size="lg">Estou pronto!</Button>
      </div>
    </div>
  );
}
