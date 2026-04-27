'use client';

import { useState } from 'react';
import { Check, Copy, Hash } from 'lucide-react';

interface GameRoomCodeButtonProps {
  roomCode: string;
}

export function CopyRoomCodeButton({ roomCode }: GameRoomCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copyToClipboard}
        type="button"
        className="group flex cursor-pointer items-center justify-center gap-1 rounded-sm p-2 text-zinc-600 transition-colors hover:bg-zinc-200/50 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-300"
      >
        <Hash size={16} className="text-zinc-500" />
        <span className="font-mono font-bold uppercase leading-none">
          {roomCode}
        </span>

        <div className="invisible ml-2 items-center justify-center text-zinc-400 group-hover:visible dark:text-zinc-500">
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </div>
      </button>
    </div>
  );
}
