'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getApiErrorMessage, startGame, toggleReady } from '@/utils/game-api';
import { MIN_PLAYERS_TO_START } from '@/constants/room';
import { useGame } from '@/hooks/game';
import { LobbyInviteButton } from './lobby-invite-button';
import { LobbyPlayerAvatar } from './lobby-player-avatar';

const showError = (title: string) => (error: unknown) => {
  toast({
    variant: 'destructive',
    title,
    description: getApiErrorMessage(error)
  });
};

export function Lobby() {
  const { currentPlayer, players, room } = useGame();
  const { mutate: readyMutate, isPending: isTogglingReady } = useMutation({
    mutationFn: () => toggleReady(room.code),
    onError: showError('Não deu pra mudar seu status')
  });
  const { mutate: startGameMutate, isPending: isStarting } = useMutation({
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
  const canStart = missingPlayers === 0 && isEveryoneReady;
  const isPlayerRoomHost = room.hostId === currentPlayer?.id;
  const isReady = !!currentPlayer?.isReady;

  const status =
    missingPlayers > 0
      ? `Faltam ${missingPlayers} ${missingPlayers === 1 ? 'jogador' : 'jogadores'} para começar.`
      : !isEveryoneReady
        ? 'Esperando todo mundo ficar pronto (o host também).'
        : isPlayerRoomHost
          ? 'Todo mundo pronto. Bora?'
          : 'Todo mundo pronto. Esperando o host começar.';

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
      <section className="relative flex w-full flex-col items-center justify-center gap-8 p-8">
        <header className="flex w-full max-w-lg flex-col items-center justify-center gap-8 text-center">
          <figure className="flex flex-col items-center">
            <div className="flex aspect-square animate-pulse items-center justify-center rounded-full bg-amber-500/5 p-6">
              <div className="flex aspect-square items-center justify-center rounded-full bg-amber-500/10 p-6">
                <div className="aspect-square h-6 w-6 rounded-full bg-amber-500" />
              </div>
            </div>
          </figure>
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
            Aguardando jogadores
          </h1>
          <span className="leading-relaxed! md:text-xl dark:text-zinc-500">
            Tem que esperar os piá entrar pra começar a loucura.
          </span>
        </header>

        <div className="flex flex-wrap items-start justify-center gap-4">
          {players.map(player => (
            <LobbyPlayerAvatar
              key={player.id}
              avatarUrl={player.avatarUrl}
              name={player.username}
              isReady={player.isReady}
              isHost={player.id === room.hostId}
              isActive={player.isActive}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1 text-center text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {players.length}/{room.maxPlayers} jogadores · {readyCount} prontos
            · {room.maxPoints} pontos para vencer
          </span>
          <span className="text-zinc-500">{status}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => readyMutate()}
            size="lg"
            variant={isReady ? 'ghost' : 'default'}
            disabled={isTogglingReady}
          >
            {isReady ? 'Calma aí' : 'Estou pronto'}
          </Button>

          {isPlayerRoomHost && (
            <Button
              onClick={() => startGameMutate()}
              size="lg"
              variant="outline"
              disabled={!canStart || isStarting}
            >
              {isStarting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Começar jogo para todos!'
              )}
            </Button>
          )}

          <LobbyInviteButton roomCode={room.code} />
        </div>

        {/* BLOB */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[320px] dark:bg-amber-500/20" />
      </section>
    </main>
  );
}
