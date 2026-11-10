'use client';

import { Check } from 'lucide-react';
import { LobbyActions } from '../lobby/lobby-actions';
import { useLobby } from '../lobby/use-lobby';
import { GameTable } from './game-table';
import { FeltAnchor } from './table-view';

// The lobby around the table: everyone takes a seat while the Room fills up.
export function TableLobby() {
  const { room, players, readyCount, status } = useLobby();

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1 flex-col">
      <GameTable
        felt={() => (
          <FeltAnchor position={{ x: 0, y: 0 }}>
            <div className="flex w-80 flex-col items-center gap-2 text-center text-white">
              <h1 className="text-4xl font-extrabold drop-shadow">
                Aguardando jogadores
              </h1>
              <span className="text-sm font-medium text-white/80">
                {players.length}/{room.maxPlayers} jogadores · {readyCount}{' '}
                prontos · {room.maxPoints} pontos para vencer
              </span>
              <span className="text-sm text-white/60">{status}</span>
            </div>
          </FeltAnchor>
        )}
        seatStatus={({ player }) =>
          player.isReady ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-500">
              <Check size={12} /> pronto
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">esperando...</span>
          )
        }
        overlay={
          <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center">
            <LobbyActions />
          </div>
        }
      />
    </main>
  );
}
