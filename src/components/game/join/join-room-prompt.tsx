'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Hash, Loader2, Lock, Trophy, Users } from 'lucide-react';
import { Grid } from '@/components/illustrations/grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/game-api';
import type { SanitizedRoom } from '@/schemas';

type JoinRoomPromptProps = {
  room: SanitizedRoom;
  playerCount: number;
  hostName: string | null;
};

// Shown when someone opens a Room link without being one of its Players.
export function JoinRoomPrompt({
  room,
  playerCount,
  hostName
}: JoinRoomPromptProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const isFull = playerCount >= room.maxPlayers;
  const isFinished = room.status === 'FINISHED';

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      api.post('/rooms/join', {
        roomCode: room.code,
        password: room.hasPassword ? password : null
      }),
    onSuccess: () => router.refresh()
  });

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <section className="z-10 flex flex-1 flex-col items-center justify-center gap-10 bg-linear-to-b from-white/80 from-50% to-white/10 p-8 dark:from-zinc-950/90 dark:from-50% dark:to-zinc-950/30">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1">
            <Hash size={20} className="text-geist-orange" />
            <span className="font-mono text-2xl font-bold">{room.code}</span>
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            {isFinished ? 'Essa partida já acabou' : 'Bora pra baixaria?'}
          </h1>
          <span className="max-w-md text-balance text-zinc-500 dark:text-zinc-400">
            {isFinished
              ? 'Chegou tarde. Crie uma sala nova ou procure outra.'
              : `${hostName ?? 'Alguém'} te chamou pra jogar. ${room.status === 'IN_PROGRESS' ? 'O jogo já começou, mas dá pra entrar a partir da próxima rodada.' : 'Entre e fique pronto.'}`}
          </span>
        </header>

        <dl className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <dt className="sr-only">Jogadores</dt>
            <dd>
              {playerCount}/{room.maxPlayers} jogadores
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} />
            <dt className="sr-only">Pontos</dt>
            <dd>{room.maxPoints} pontos para vencer</dd>
          </div>
          {room.hasPassword && (
            <div className="flex items-center gap-2">
              <Lock size={16} />
              <dd>Sala com senha</dd>
            </div>
          )}
        </dl>

        {!isFinished && (
          <form
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={event => {
              event.preventDefault();
              mutate();
            }}
          >
            {room.hasPassword && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="room-password">Senha da sala</Label>
                <Input
                  id="room-password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
              </div>
            )}

            {error && (
              <span className="text-sm text-red-500">
                {getApiErrorMessage(error)}
              </span>
            )}

            <Button type="submit" size="lg" disabled={isFull || isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFull ? (
                'Sala cheia'
              ) : (
                'Entrar na sala'
              )}
            </Button>
          </form>
        )}

        <Button variant="ghost" asChild>
          <Link href="/dashboard">Voltar ao dashboard</Link>
        </Button>
      </section>

      <Grid className="absolute scale-125 stroke-zinc-200 object-cover dark:stroke-zinc-900" />
    </div>
  );
}
