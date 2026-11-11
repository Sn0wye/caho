'use client';

import dynamic from 'next/dynamic';
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

// WebGL only: three.js never loads for the other layouts or on the server.
const Table3D = dynamic(
  () => import('@/components/game/table3d/table-3d').then(m => m.Table3D),
  { ssr: false }
);

export const Game = () => {
  const { room } = useGame();
  useRestoreGameLayout();
  const layout = useGameLayout(state => state.layout);
  const isTable = layout === 'table';

  if (layout === '3d') {
    // One scene for the whole Room, lobby to podium, so nothing ever cuts.
    // Always dark: the room is lit by the lamp over the table, whatever the
    // app theme.
    return (
      <div className="dark flex h-screen w-full flex-col items-center justify-between bg-zinc-950 text-zinc-50">
        <GameNavbar />
        <Table3D />
        <GameConnectionBanner />
      </div>
    );
  }

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
