'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/utils/cn';

const URGENT_SECONDS = 10;

type GameCountdownProps = {
  deadline: Date | null;
};

export function GameCountdown({ deadline }: GameCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) return null;

  const secondsLeft = Math.max(0, Math.ceil((deadline.getTime() - now) / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-sm font-bold tabular-nums',
        secondsLeft <= URGENT_SECONDS
          ? 'bg-red-500/10 text-red-500'
          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
      )}
      role="timer"
      aria-label={`${secondsLeft} segundos restantes`}
    >
      <Timer size={14} />
      <span>
        {minutes}:{seconds}
      </span>
    </div>
  );
}
