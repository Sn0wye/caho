'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { useGame } from '@/hooks/game';
import { LobbyPlayerAvatar } from './lobby-player-avatar';

const isReadyMutation = async (code: string) => {
  await api.post(`/rooms/${code}/ready`);
};

export function Lobby() {
  const { currentPlayer, players, room } = useGame();
  const { mutate } = useMutation(isReadyMutation);

  function handleToggleReady() {
    mutate(room.code);
  }

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
          <span className="!leading-relaxed dark:text-zinc-500 md:text-xl">
            Tem que esperar os piá entrar pra começar a loucura.
          </span>
        </header>

        <div className="flex items-center space-x-4">
          {players.map(player => (
            <LobbyPlayerAvatar
              key={player.id}
              avatarUrl={player.avatarUrl}
              name={player.username}
              isReady={player.isReady}
            />
          ))}
        </div>
        {/* TODO: Callback state. */}
        <Button onClick={handleToggleReady} size="lg">
          {currentPlayer.isReady ? 'Calma aí' : 'Estou pronto'}
        </Button>

        {/* BLOB */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[320px] dark:bg-amber-500/20" />
      </section>
    </main>
  );
}
