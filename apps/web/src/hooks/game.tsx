'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { PlayerEvent, RoomEvent } from '@caho/contracts';
import type {
  BlackCard,
  Player,
  Room,
  RoundPlayedCard,
  WhiteCard
} from '@caho/schemas';
import { env } from '@/env.mjs';

const PING_INTERVAL_IN_SECONDS = 30 * 1000;

type GameContextType = {
  room: Room;
  currentPlayer: Player;
  currentBlackCard: BlackCard | null;
  currentWhiteCards: WhiteCard[];
  selectedWhiteCards: WhiteCard[];
  handlePickWhiteCard: (card: WhiteCard) => void;
  handleUnpickWhiteCard: (card: WhiteCard) => void;
  isWhiteCardPickingDisabled: boolean;
  roundPlayedCards: RoundPlayedCard[];
  players: Player[];
};

type WebsocketEvent = PlayerEvent | RoomEvent;

const GameContext = createContext<GameContextType>({} as GameContextType);

type GameContextProviderProps = {
  initialRoom: Room;
  initialCurrentPlayer: Player;
  initialPlayers: Player[];
  initialBlackCard: BlackCard;
  initialWhiteCards: WhiteCard[];
  children: React.ReactNode;
};

export const GameContextProvider = ({
  initialRoom,
  initialCurrentPlayer,
  initialPlayers,
  initialBlackCard,
  initialWhiteCards,
  children
}: GameContextProviderProps) => {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [currentPlayer, setCurrentPlayer] =
    useState<Player>(initialCurrentPlayer);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentBlackCard, setCurrentBlackCard] = useState<BlackCard | null>(
    initialBlackCard ?? null
  );
  const [currentWhiteCards, setCurrentWhiteCards] = useState<WhiteCard[]>(
    initialWhiteCards ?? []
  );
  const [selectedWhiteCards, setSelectedWhiteCards] = useState<WhiteCard[]>([]);
  const [roundPlayedCards, setRoundPlayedCards] = useState<RoundPlayedCard[]>(
    []
  );
  const [roundWinner, setRoundWinner] = useState<RoundPlayedCard | null>(null);

  const cardsToPickAmount = currentBlackCard?.pick ?? 0;
  const isWhiteCardPickingDisabled =
    selectedWhiteCards?.length === cardsToPickAmount;

  const handlePickWhiteCard = (card: WhiteCard) => {
    const isAlreadySelected = selectedWhiteCards.some(
      existingCard => existingCard.id === card.id
    );

    if (isAlreadySelected || isWhiteCardPickingDisabled) {
      return;
    }

    setSelectedWhiteCards(prev => {
      if (isAlreadySelected) {
        return prev.filter(prevCard => prevCard.id !== card.id);
      }

      return [...prev, card];
    });

    setCurrentWhiteCards(prev => {
      return prev.filter(prevCard => prevCard.id !== card.id);
    });
  };

  const handleUnpickWhiteCard = (card: WhiteCard) => {
    setSelectedWhiteCards(prev =>
      prev.filter(prevCard => prevCard.id !== card.id)
    );

    setCurrentWhiteCards(prev => {
      return [...prev, card];
    });
  };

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
        case 'room.round-start': {
          setCurrentBlackCard(data.payload.blackCard);
          setRoom(prevRoom => ({
            ...prevRoom,
            round: data.payload.roundNumber
          }));
          setSelectedWhiteCards([]);
          break;
        }
        case 'player.cards-drawn': {
          setCurrentWhiteCards(prev => {
            const newCards = data.payload.filter(
              (card: WhiteCard) => !prev.some(c => c.id === card.id)
            );
            return [...prev, ...newCards];
          });
          break;
        }
        case 'room.time-to-judge': {
          setRoundPlayedCards(data.payload.roundPlayedCards);
          break;
        }
        case 'room.round-end': {
          setRoundWinner(data.payload);
          break;
        }
        default:
          console.log('[WS]: Unhandled event:', {
            event: data.event,
            payload: data.payload
          });
          break;
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
        }, PING_INTERVAL_IN_SECONDS);

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
        handlePickWhiteCard,
        handleUnpickWhiteCard,
        isWhiteCardPickingDisabled,
        selectedWhiteCards,
        roundPlayedCards,
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
