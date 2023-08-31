'use client';

import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';
import { type Room } from '@/server/schemas/room';
import { useStorage } from 'liveblocks.config';

type GameProps = Room;

export const Game = ({ status }: GameProps) => {
  const room = useStorage(s => s.room);

  console.log('room storage data', room);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar gameStatus={status} />

      {status === 'LOBBY' && <Lobby />}
      {status === 'IN_PROGRESS' && <Ongoing />}

      {/**
       * //TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle dark mode button
       * - [ ] Toggle fullscreen button
       *
       */}
    </div>
  );
};
