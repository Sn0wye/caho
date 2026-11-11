'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/utils/game-api';
import { useGame } from '@/hooks/game';

// The judging phase's answers and the Judge's pick, shared by the classic and
// table layouts.
export function useJudgePick() {
  const { round, isJudge, actions } = useGame();
  const [chosenPlayerId, setChosenPlayerId] = useState<string | null>(null);

  // Sorted by id (random cuid) so the order doesn't reveal who played first,
  // and every client sees the same table.
  const answers = useMemo(
    () =>
      [...(round?.playedCards ?? [])].sort((a, b) => a.id.localeCompare(b.id)),
    [round?.playedCards]
  );

  const { mutate: confirmWinner, isPending } = useMutation({
    mutationFn: (playerId: string) => actions.pickWinner(playerId),
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Não deu pra escolher o vencedor',
        description: getApiErrorMessage(error)
      });
    }
  });

  return {
    round,
    isJudge,
    answers,
    chosenPlayerId,
    setChosenPlayerId,
    confirmWinner,
    isPending
  };
}
