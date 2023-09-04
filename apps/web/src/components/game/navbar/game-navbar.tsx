'use client';

import { type RoomStatus } from '@caho/schemas';
import { LogoText } from '@/components/brand/logo-text';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GameNavbarStatus } from './game-navbar-status';
import { GameRoomCodeButton } from './game-room-code-button';

type GameNavbarProps = {
  gameStatus: RoomStatus;
};

export function GameNavbar({ gameStatus }: GameNavbarProps) {
  const { toast } = useToast();

  function handleLeaveRoom() {
    toast({
      variant: 'warning',
      title: 'WARN LOG | ROOM.EXIT',
      description:
        'Essa sala já está cheia! Tente outra sala ou crie sua própria sessão.'
    });
  }

  return (
    <nav className="relative flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-inherit px-8 py-4 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <LogoText />
        <GameRoomCodeButton roomCode="LED524" />
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <GameNavbarStatus gameStatus={gameStatus} />
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <Button onClick={handleLeaveRoom}>Sair da sala</Button>
      </div>
    </nav>
  );
}
