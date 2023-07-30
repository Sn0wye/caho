'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockPlayers } from '@/mock/players';
import { cn } from '@/utils/cn';
import { Fragment } from 'react';
import { create } from 'zustand';
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
        isCollapsed ? 'w-24' : 'relative max-w-sm flex-1'
      )}
    >
      <GameRankingHeader />

      {isCollapsed ? (
        <div className="flex w-full flex-col items-center">
          {mockPlayers.map((player, idx) => (
            <div
              className="flex h-[4.5rem] w-full flex-col items-center justify-center"
              key={idx}
            >
              <Avatar
                variant={!player.isConnected ? 'ghost' : null}
                ring={
                  !player.isConnected
                    ? 'ghost'
                    : player.isHost
                    ? 'purple'
                    : player.isJudge
                    ? 'orange'
                    : null
                }
              >
                <AvatarImage src={player.avatarSrc} />
                <AvatarFallback>{player.initials}</AvatarFallback>
              </Avatar>

              <div className="-mt-2 flex flex-col gap-1">
                {player.isHost && (
                  <Badge
                    variant="purple"
                    className="z-10 uppercase"
                    size="avatar"
                  >
                    host
                  </Badge>
                )}
                {player.isJudge && (
                  <Badge
                    variant="orange"
                    className="z-10 uppercase"
                    size="avatar"
                  >
                    juiz
                  </Badge>
                )}

                {!player.isConnected && (
                  <Badge
                    variant="ghost"
                    className="z-10 uppercase"
                    size="avatar"
                  >
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-24 flex w-full flex-1 flex-col items-center gap-2">
          {mockPlayers.map((player, idx) => (
            <Fragment key={idx}>
              <GameRankingPlayer  data={player} />
              <Separator className="last:hidden" />
            </Fragment>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
