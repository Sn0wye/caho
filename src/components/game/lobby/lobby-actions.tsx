'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LobbyInviteButton } from './lobby-invite-button';
import { useLobby } from './use-lobby';

export function LobbyActions() {
  const lobby = useLobby();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        onClick={lobby.toggleReady}
        size="lg"
        variant={lobby.isReady ? 'ghost' : 'default'}
        disabled={lobby.isTogglingReady}
      >
        {lobby.isReady ? 'Calma aí' : 'Estou pronto'}
      </Button>

      {lobby.isPlayerRoomHost && (
        <Button
          onClick={lobby.startGame}
          size="lg"
          variant="outline"
          disabled={!lobby.canStart || lobby.isStarting}
        >
          {lobby.isStarting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Começar jogo para todos!'
          )}
        </Button>
      )}

      <LobbyInviteButton roomCode={lobby.room.code} />
    </div>
  );
}
