'use client';

import { GameFinished } from '@/components/game/finished/game-finished';
import { GameConnectionBanner } from '@/components/game/game-connection-banner';
import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';
import { GameRoundResult } from '@/components/game/round/game-round-result';
import { useGame } from '@/hooks/game';

export const Game = () => {
  const { room } = useGame();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar />

      {room.status === 'LOBBY' && <Lobby />}
      {room.status === 'IN_PROGRESS' && <Ongoing />}
      {room.status === 'FINISHED' && <GameFinished />}

      <GameRoundResult />
      <GameConnectionBanner />
    </div>
  );
};
