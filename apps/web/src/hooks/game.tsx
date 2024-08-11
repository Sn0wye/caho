'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { PlayerEvent, RoomEvent } from '@caho/contracts';
import type { BlackCard, Player, Room, WhiteCard } from '@caho/schemas';
import { env } from '@/env.mjs';

// 30 seconds
const PING_INTERVAL = 30000;

type GameContextType = {
  currentPlayer: Player;
  players: Player[];
  room: Room;
  currentBlackCard: BlackCard | null;
  currentWhiteCards: WhiteCard[];
};

type WebsocketEvent = PlayerEvent | RoomEvent;

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
  const [currentBlackCard, setCurrentBlackCard] = useState<BlackCard | null>(
    null
  );
  const [currentWhiteCards, setCurrentWhiteCards] = useState<WhiteCard[]>([]);

  useEffect(() => {
    const roomWs = new WebSocket(
      `${env.NEXT_PUBLIC_WEBSOCKET_URL}/room/${initialRoom.code}`
    );

    const playerWs = new WebSocket(
      `${env.NEXT_PUBLIC_WEBSOCKET_URL}/${currentPlayer.id}`
    );

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as WebsocketEvent;

      switch (data.event) {
        case 'room.player-joined': {
          setPlayers(prevPlayers => [...prevPlayers, data.payload]);
          break;
        }
        case 'room.player-left': {
          setPlayers(prevPlayers =>
            prevPlayers.filter(player => player.id !== data.payload.id)
          );
          break;
        }
        case 'room.player-update': {
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
        case 'room.started': {
          const updatedRoom = data.payload;
          setRoom(updatedRoom);

          break;
        }
        case 'room.black-card-drawn': {
          setCurrentBlackCard(data.payload);
          break;
        }
        case 'player.cards-drawn': {
          setCurrentWhiteCards(data.payload);
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

    const setupWebSocket = (ws: WebSocket) => {
      ws.onopen = () => {
        console.log(`[WS]: Connected to the WebSocket server ${ws.url}`);

        // Set up an interval to send pings every 30 seconds
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
            console.log('[WS]: Ping sent');
          }
        }, PING_INTERVAL);

        ws.onclose = () => {
          console.log(`[WS]: Disconnected from the WebSocket server ${ws.url}`);
          clearInterval(pingInterval);
        };

        ws.onerror = error => {
          console.error('WebSocket error:', error);
          clearInterval(pingInterval);
        };
      };

      ws.onmessage = handleWebSocketMessage;
    };

    setupWebSocket(roomWs);
    setupWebSocket(playerWs);

    return () => {
      roomWs.close();
      playerWs.close();
    };
  }, [initialRoom.code, currentPlayer.id]);

  return (
    <GameContext.Provider
      value={{
        room,
        currentPlayer,
        currentBlackCard,
        currentWhiteCards,
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
