'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LobbyInviteButtonProps = {
  roomCode: string;
};

// Copies a link straight to the Room; opening it as a non-member lands on the
// join screen.
export function LobbyInviteButton({ roomCode }: LobbyInviteButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/room/${roomCode}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button size="lg" variant="ghost" onClick={copyInvite} className="gap-2">
      {isCopied ? <Check size={16} /> : <Link2 size={16} />}
      {isCopied ? 'Link copiado!' : 'Copiar convite'}
    </Button>
  );
}
