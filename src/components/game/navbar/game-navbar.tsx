'use client';

import Link from 'next/link';
import { LogoText } from '@/components/brand/logo-text';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { useGame } from '@/hooks/game';
import { GameEndButton } from './game-end-button';
import { GameLayoutToggle } from './game-layout-toggle';
import { GameLeaveButton } from './game-leave-button';
import { GameNavbarStatus } from './game-navbar-status';
import { CopyRoomCodeButton } from './game-room-code-button';

export function GameNavbar() {
  const { room, currentPlayer } = useGame();
  const isHost = room.hostId === currentPlayer?.id;
  const isFinished = room.status === 'FINISHED';

  return (
    <nav className="relative flex h-16 w-full shrink-0 items-center justify-between border-b border-zinc-200 bg-inherit px-8 py-4 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <LogoText />
        <CopyRoomCodeButton roomCode={room.code} />
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <GameNavbarStatus gameStatus={room.status} />
      </div>

      <div className="flex items-center gap-3">
        {!isFinished && <GameLayoutToggle />}
        <ThemeSwitcher />
        {isHost && room.status === 'IN_PROGRESS' && <GameEndButton />}
        {isFinished ? (
          <Button asChild>
            <Link href="/dashboard">Voltar ao dashboard</Link>
          </Button>
        ) : (
          <GameLeaveButton />
        )}
      </div>
    </nav>
  );
}
