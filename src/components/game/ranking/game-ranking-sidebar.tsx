'use client';

import { Fragment } from 'react';
import { create } from 'zustand';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { mockPlayers } from '@/mock/players';
import { GameRankingHeader } from './game-ranking-header';
import { GameRankingPlayer } from './game-ranking-player';

type GameRankingSidebarContext = {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};

export const useGameRankingSidebarContext = create<GameRankingSidebarContext>(
  set => ({
    isCollapsed: false,
    setIsCollapsed: isCollapsed => set({ isCollapsed })
  })
);

export function GameRankingSidebar() {
  const { isCollapsed } = useGameRankingSidebarContext();

  return (
    <ScrollArea
      className={cn(
        'h-[calc(100vh-4rem)] flex-col items-center justify-between border-r border-zinc-200 p-4 dark:border-zinc-900',
        isCollapsed ? 'w-28' : 'relative max-w-sm flex-1'
      )}
    >
      <GameRankingHeader />

      <div className="mt-24 flex w-full flex-1 flex-col items-center gap-2">
        {mockPlayers.map((player, idx) => (
          <Fragment key={idx}>
            <GameRankingPlayer player={player} />
            <Separator className="last:hidden" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
