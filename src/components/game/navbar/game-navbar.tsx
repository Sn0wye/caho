import { LogoText } from '@/components/brand/logo-text';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { GameRoomCodeButton } from './game-room-code-button';

interface GameNavbarProps {}

export function GameNavbar({}: GameNavbarProps) {
  return (
    <nav className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-inherit px-8 py-4 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <LogoText />
        <GameRoomCodeButton />
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        {/* TODO: Button to exit */}
        <span>Botão do arregão.</span>
      </div>
    </nav>
  );
}
