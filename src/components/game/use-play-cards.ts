'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/utils/game-api';
import { useGame } from '@/hooks/game';
import type { WhiteCard } from '@/schemas';

// Submits this Player's picks for the Round, shared by every layout.
export function usePlayCards() {
  const { actions, markCardsPlayed } = useGame();

  const { mutate: submitCards, isPending } = useMutation({
    mutationFn: (cards: WhiteCard[]) =>
      actions.playCards(cards.map(card => card.id)),
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

  return { submitCards, isPending };
}
