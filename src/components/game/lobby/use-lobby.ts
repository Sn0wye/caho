'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { getApiErrorMessage, startGame, toggleReady } from '@/utils/game-api';
import { MIN_PLAYERS_TO_START } from '@/constants/room';
import { useGame } from '@/hooks/game';

const showError = (title: string) => (error: unknown) => {
  toast({
    variant: 'destructive',
    title,
    description: getApiErrorMessage(error)
  });
};

// The lobby's rules and actions, shared by the classic and table layouts.
export function useLobby() {
  const { currentPlayer, players, room } = useGame();
  const ready = useMutation({
    mutationFn: () => toggleReady(room.code),
    onError: showError('Não deu pra mudar seu status')
  });
  const start = useMutation({
    mutationFn: () => startGame(room.code),
    onError: showError('Não deu pra começar o jogo')
  });

  const activePlayers = players.filter(player => player.isActive);
  const readyCount = activePlayers.filter(player => player.isReady).length;
  const missingPlayers = Math.max(
    0,
    MIN_PLAYERS_TO_START - activePlayers.length
  );
  const isEveryoneReady = readyCount === activePlayers.length;
  const isPlayerRoomHost = room.hostId === currentPlayer?.id;

  const status =
    missingPlayers > 0
      ? `Faltam ${missingPlayers} ${missingPlayers === 1 ? 'jogador' : 'jogadores'} para começar.`
      : !isEveryoneReady
        ? 'Esperando todo mundo ficar pronto (o host também).'
        : isPlayerRoomHost
          ? 'Todo mundo pronto. Bora?'
          : 'Todo mundo pronto. Esperando o host começar.';

  return {
    room,
    players,
    readyCount,
    status,
    isPlayerRoomHost,
    isReady: !!currentPlayer?.isReady,
    canStart: missingPlayers === 0 && isEveryoneReady,
    toggleReady: () => ready.mutate(),
    isTogglingReady: ready.isPending,
    startGame: () => start.mutate(),
    isStarting: start.isPending
  };
}
