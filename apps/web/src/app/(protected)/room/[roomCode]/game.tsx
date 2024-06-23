'use client';

import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { useGame } from '@/hooks/game';

export const Game = () => {
  const { room } = useGame();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar roomCode={room.code} roomStatus={room.status} />

      {room.status === 'LOBBY' && <Lobby />}
      {/* {room.status === 'LOBBY' && <Ongoing />} */}

      {/**
       * //TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle fullscreen button
       *
       */}
    </div>
  );
};
