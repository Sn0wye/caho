'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { RoomEvent } from '@caho/contracts';
import type { Player, Room } from '@caho/schemas';
import { env } from '@/env.mjs';

// 30 seconds
const PING_INTERVAL = 30000;

type GameContextType = {
  currentPlayer: Player;
  players: Player[];
  room: Room;
};

const GameContext = createContext<GameContextType>({} as GameContextType);

type GameContextProviderProps = {
  initialRoom: Room;
  initialCurrentPlayer: Player;
  initialPlayers: Player[];
  children: React.ReactNode;
};

export const GameContextProvider = ({
  initialRoom,
  initialCurrentPlayer,
  initialPlayers,
  children
}: GameContextProviderProps) => {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [currentPlayer, setCurrentPlayer] =
    useState<Player>(initialCurrentPlayer);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    const ws = new WebSocket(
      `${env.NEXT_PUBLIC_WEBSOCKET_URL}/room/${initialRoom.code}`
    );

    ws.onopen = () => {
      console.log('[WS]: Connected to the WebSocket server');

      // Set up an interval to send pings every 30 seconds
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
          console.log('[WS]: Ping sent');
        }
      }, PING_INTERVAL);

      ws.onclose = () => {
        console.log('[WS]: Disconnected from the WebSocket server');
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
        case 'room-started': {
          const updatedRoom = data.payload;
          setRoom(updatedRoom);

          break;
        }
        default: {
          console.log('[WS]: Unhandled event:', {
            event: data.event,
            payload: data.payload
          });
          break;
        }
      }
      console.log('[WS]: Message received:', data);
    };

    return () => {
      ws.close();
    };
  }, [initialRoom.code, currentPlayer.id]);

  return (
    <GameContext.Provider
      value={{
        room,
        currentPlayer,
        players
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
