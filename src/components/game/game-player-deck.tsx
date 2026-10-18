'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getApiErrorMessage, playCards } from '@/utils/game-api';
import { useGame } from '@/hooks/game';
import type { WhiteCard as WhiteCardType } from '@/schemas';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { WhiteCard } from './cards/white-card';

const overlayClassName =
  'absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 overflow-clip backdrop-blur-xs before:absolute before:bottom-0 before:-z-10 before:aspect-square before:h-1/2 before:translate-y-1/2 before:rounded-full before:bg-zinc-950 before:blur-[120px] after:absolute after:inset-0 after:-z-20 after:bg-linear-to-b after:from-white after:to-white/10 after:content-[""] dark:before:bg-zinc-400 dark:after:from-zinc-950 dark:after:to-zinc-950/90';

type GamePlayerDeckProps = {
  // Which card (by position in the Hand) the pointer rests on, or null.
  onCardHover?: (card: number | null) => void;
};

export function GamePlayerDeck({ onCardHover }: GamePlayerDeckProps = {}) {
  const {
    room,
    visibleHand,
    selectedCards,
    selectCard,
    isSelectionComplete,
    isJudge,
    hasPlayed,
    markCardsPlayed
  } = useGame();

  const { mutate: submitCards, isPending } = useMutation({
    mutationFn: (cards: WhiteCardType[]) =>
      playCards(
        room.code,
        cards.map(card => card.id)
      ),
    // The refilled Hand can arrive over the socket before this resolves, so use
    // the cards captured at submit time.
    onSuccess: (_, cards) => markCardsPlayed(cards),
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Não deu pra jogar essas cartas',
        description: getApiErrorMessage(error)
      });
    }
  });

  if (isJudge) {
    return (
      <div className='relative flex h-full max-h-96 w-full max-w-full flex-col items-center justify-center gap-2 overflow-clip text-center backdrop-blur-xs before:absolute before:bottom-0 before:-z-10 before:aspect-square before:h-1/2 before:translate-y-1/2 before:rounded-full before:bg-zinc-950 before:blur-[120px] after:absolute after:inset-0 after:-z-20 after:bg-linear-to-b after:from-white after:to-white/10 after:content-[""] dark:before:bg-yellow-800 dark:after:from-zinc-950 dark:after:to-zinc-950/90'>
        <Image src="/judge.png" alt="Juiz" width={200} height={200} />

        <h3 className="text-2xl font-bold">
          Como já esperado, Juiz não trabalha no Brasil...
        </h3>
        <span className="text-sm text-balance text-zinc-700 dark:text-zinc-300">
          Espere os jogadores escolherem suas atrocidades para você escolher a
          melhor.
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full max-h-96 w-full max-w-full items-center">
      <div
        className={cn(
          'flex h-full w-full snap-x snap-mandatory flex-row items-center -space-x-32 overflow-x-auto scroll-smooth px-16 py-8',
          'justify-start xl:justify-center'
        )}
      >
        {visibleHand.map((card, index) => (
          <WhiteCard
            key={card.id}
            data={card}
            onClick={selectCard}
            disabled={isSelectionComplete || hasPlayed}
            onHoverChange={isHovered => onCardHover?.(isHovered ? index : null)}
          />
        ))}
      </div>

      {isSelectionComplete && !hasPlayed && (
        <DeckOverlay
          title="Escolheu sua atrocidade?"
          description="Para desfazer uma carta jogada, basta clicar no texto dela na carta preta e ela retornará ao baralho"
        >
          <Button
            size="lg"
            onClick={() => submitCards(selectedCards)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Estou pronto!'
            )}
          </Button>
        </DeckOverlay>
      )}

      {hasPlayed && (
        <DeckOverlay
          title="Você já jogou! Agora é só esperar a rodada acabar..."
          description="Aguarde o juiz escolher a melhor atrocidade e o jogo prosseguir"
        />
      )}
    </div>
  );
}

type DeckOverlayProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

function DeckOverlay({ title, description, children }: DeckOverlayProps) {
  return (
    <div className={overlayClassName}>
      <header className="flex max-w-xs flex-col items-center justify-center gap-1 text-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="text-sm text-balance text-zinc-700 dark:text-zinc-300">
          {description}
        </span>
      </header>

      {children}
    </div>
  );
}
