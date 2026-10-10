'use client';

import { Loader2, WifiOff } from 'lucide-react';
import { useGame } from '@/hooks/game';

export function GameConnectionBanner() {
  const { connection } = useGame();

  if (connection === 'open' || connection === 'connecting') return null;

  const isRejected = connection === 'rejected';

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
    >
      {isRejected ? (
        <WifiOff size={16} className="text-red-500" />
      ) : (
        <Loader2 size={16} className="animate-spin text-amber-500" />
      )}
      <span className="text-zinc-700 dark:text-zinc-300">
        {isRejected
          ? 'Sua sessão expirou. Entre novamente para continuar jogando.'
          : 'Conexão perdida. Reconectando...'}
      </span>
    </div>
  );
}
