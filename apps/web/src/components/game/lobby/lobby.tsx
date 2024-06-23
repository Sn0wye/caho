'use client';

import { useEffect, useState } from 'react';
import type { RoomEvent } from '@caho/contracts';
import type { Player, Room } from '@caho/schemas';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { LobbyPlayerAvatar } from './lobby-player-avatar';

const isReadyMutation = async (code: string) => {
  await api.post(`/rooms/${code}/ready`);
};

type LobbyProps = {
  room: Room;
  initialPlayers: Player[];
  initialCurrentPlayer: Player;
};

// 30 seconds
const PING_INTERVAL = 30000;

export function Lobby({
  room,
  initialPlayers,
  initialCurrentPlayer
}: LobbyProps) {
  const [currentPlayer, setCurrentPlayer] =
    useState<Player>(initialCurrentPlayer);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const { mutate } = useMutation(isReadyMutation);

  const handleToggleReady = () => {
    mutate(room.code);
  };

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/room/${room.code}`);

    ws.onopen = () => {
      console.log('Connected to the WebSocket server');

      // Set up an interval to send pings every 30 seconds
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
          console.log('Ping sent');
        }
      }, PING_INTERVAL);

      ws.onclose = () => {
        console.log('Disconnected from the WebSocket server');
        clearInterval(pingInterval);
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
        clearInterval(pingInterval);
      };
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data) as RoomEvent;

      switch (data.event) {
        case 'player-joined': {
          setPlayers(prevPlayers => [...prevPlayers, data.payload]);
          break;
        }
        case 'player-left': {
          setPlayers(prevPlayers =>
            prevPlayers.filter(player => player.id !== data.payload.id)
          );
          break;
        }
        case 'player-update': {
          const updatedPlayer = data.payload;
          setPlayers(prevPlayers =>
            prevPlayers.map(player =>
              player.id === updatedPlayer.id ? updatedPlayer : player
            )
          );

          if (updatedPlayer.id === currentPlayer.id) {
            setCurrentPlayer(updatedPlayer);
          }

          break;
        }
        default: {
          console.log('Unhandled event:', {
            event: data.event,
            payload: data.payload
          });
          break;
        }
      }
      console.log('Message received:', data);
      // setMessages(prevMessages => [...prevMessages, event.data]);
    };

    return () => {
      ws.close();
    };
  }, [room.code, currentPlayer.id]);

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
      <section className="relative flex w-full flex-col items-center justify-center gap-8 p-8">
        <header className="flex w-full max-w-lg flex-col items-center justify-center gap-8 text-center">
          <figure className="flex flex-col items-center">
            <div className="flex aspect-square animate-pulse items-center justify-center rounded-full bg-amber-500/5 p-6">
              <div className="flex aspect-square items-center justify-center rounded-full bg-amber-500/10 p-6">
                <div className="aspect-square h-6 w-6 rounded-full bg-amber-500" />
              </div>
            </div>
          </figure>
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
            Aguardando jogadores
          </h1>
          <span className="!leading-relaxed dark:text-zinc-500 md:text-xl">
            Tem que esperar os piá entrar pra começar a loucura.
          </span>
        </header>

        <div className="flex items-center space-x-4">
          {players.map(player => (
            <LobbyPlayerAvatar
              key={player.id}
              avatarUrl={player.avatarUrl}
              name={player.username}
              isReady={player.isReady}
            />
          ))}
        </div>
        {/* TODO: Callback state. */}
        <Button onClick={handleToggleReady} size="lg">
          {currentPlayer.isReady ? 'Calma aí' : 'Estou pronto'}
        </Button>

        {/* BLOB */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[320px] dark:bg-amber-500/20" />
      </section>
    </main>
  );
}
