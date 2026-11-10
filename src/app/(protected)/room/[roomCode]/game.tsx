'use client';

import { GameFinished } from '@/components/game/finished/game-finished';
import { GameConnectionBanner } from '@/components/game/game-connection-banner';
import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';
import { GameRoundResult } from '@/components/game/round/game-round-result';
import { TableLobby } from '@/components/game/table/table-lobby';
import { TableOngoing } from '@/components/game/table/table-ongoing';
import {
  useGameLayout,
  useRestoreGameLayout
} from '@/components/game/table/use-game-layout';
import { useGame } from '@/hooks/game';

export const Game = () => {
  const { room } = useGame();
  useRestoreGameLayout();
  const isTable = useGameLayout(state => state.layout) === 'table';

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar />

      {room.status === 'LOBBY' && (isTable ? <TableLobby /> : <Lobby />)}
      {room.status === 'IN_PROGRESS' &&
        (isTable ? <TableOngoing /> : <Ongoing />)}
      {room.status === 'FINISHED' && <GameFinished />}

      <GameRoundResult />
      <GameConnectionBanner />
    </div>
  );
};
