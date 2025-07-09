'use client';

import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';
import { useGame } from '@/hooks/game';

export const Game = () => {
  const { room } = useGame();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar roomCode={room.code} roomStatus={room.status} />

      {room.status === 'LOBBY' && <Lobby />}
      {room.status === 'IN_PROGRESS' && <Ongoing />}

      {/**
       * //TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       *
       */}
    </div>
  );
};
