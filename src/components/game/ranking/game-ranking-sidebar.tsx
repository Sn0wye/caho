'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { mockPlayers } from '@/mock/players';
import { GameRankingCollapseButton } from './game-ranking-collapse-button';
import { GameRankingPlayer } from './game-ranking-player';

interface GameRankingSidebarProps {}

export function GameRankingSidebar({}: GameRankingSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ScrollArea
      className={cn(
        'h-[calc(100vh-4rem)] flex-col items-center justify-between border-r border-zinc-200 p-4 dark:border-zinc-900',
        isOpen ? 'relative max-w-sm flex-1' : 'w-24'
      )}
    >
      {isOpen ? (
        <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between bg-gradient-to-b from-zinc-50 via-zinc-50 to-transparent p-8 pb-16 dark:from-zinc-950 dark:via-zinc-950">
          <h2 className="text-3xl font-bold">Ranking</h2>
          <GameRankingCollapseButton setIsOpen={setIsOpen} isOpen={isOpen} />
        </header>
      ) : (
        <header className="flex w-full flex-col items-center gap-4">
          <GameRankingCollapseButton setIsOpen={setIsOpen} isOpen={isOpen} />
          <Separator />
        </header>
      )}

      {isOpen ? (
        <div className="mt-24 flex w-full flex-1 flex-col items-center gap-2">
          {mockPlayers.map((player, idx) => (
            <>
              <GameRankingPlayer key={idx} data={player} />
              <Separator className="last:hidden" />
            </>
          ))}
        </div>
      ) : (
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
      )}
    </ScrollArea>
  );
}
