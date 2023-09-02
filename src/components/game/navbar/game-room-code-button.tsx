import { Copy, Hash } from 'lucide-react';

interface GameRoomCodeButtonProps {
  roomCode: string;
};

// TODO: Add copy to clipboard functionality
// TODO: Use framer motion to animate the copy to clipboard button

export function GameRoomCodeButton({roomCode}: GameRoomCodeButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="group flex cursor-pointer items-center justify-center gap-1 rounded p-2 text-zinc-600 transition-colors hover:bg-zinc-200/50 hover:text-zinc-800 dark:text-zinc-500 hover:dark:bg-zinc-900/50 hover:dark:text-zinc-300">
        <Hash size={16} className="text-zinc-500" />
        <span className="font-mono font-bold leading-none uppercase">{roomCode}</span>

        <div className="ml-2 hidden items-center justify-center text-zinc-400 group-hover:flex dark:text-zinc-500">
          <Copy size={14} />
        </div>
      </div>
    </div>
  );
}
