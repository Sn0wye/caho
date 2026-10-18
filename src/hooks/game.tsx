'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import {
  fetchRoomResync,
  fetchRoundSnapshot,
  type RoomResync
} from '@/utils/game-api';
import { ROUND_RESULT_DISPLAY_MS } from '@/constants/room';
import {
  isCursorEvent,
  type CursorMessage,
  type PlayerEvent,
  type RoomEvent
} from '@/contracts';
import type { RoomPlayer, WhiteCard } from '@/schemas';
import { CursorStore } from './cursor-store';
import {
  gameReducer,
  rankingFromPlayers,
  roundFromSnapshot,
  type GameState
} from './game-reducer';
import { useRoomSockets, type SocketStatus } from './use-room-sockets';

type GameContextType = GameState & {
  currentPlayer: RoomPlayer | null;
  judgeId: string | null;
  isJudge: boolean;
  // Mid-game `isReady` means the Player already played this Round.
  hasPlayed: boolean;
  visibleHand: WhiteCard[];
  selectedCards: WhiteCard[];
  isSelectionComplete: boolean;
  connection: SocketStatus;
  // Other Players' live cursors; read with useSyncExternalStore.
  cursors: CursorStore;
  sendCursor: (message: CursorMessage) => void;
  selectCard: (card: WhiteCard) => void;
  unselectCard: (card: WhiteCard) => void;
  markCardsPlayed: (cards: WhiteCard[]) => void;
  dismissResult: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

type GameContextProviderProps = {
  userId: string;
  initialState: RoomResync;
  children: React.ReactNode;
};

export const GameContextProvider = ({
  userId,
  initialState,
  children
}: GameContextProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, init);
  const roomCode = state.room.code;
  const [cursors] = useState(() => new CursorStore());

  const loadDeadlines = useCallback(() => {
    fetchRoundSnapshot(roomCode)
      .then(snapshot => snapshot && dispatch({ type: 'deadlines', snapshot }))
      .catch(error => console.error('[game] deadline fetch failed', error));
  }, [roomCode]);

  const handleEvent = useCallback(
    (event: RoomEvent | PlayerEvent) => {
      // Cursors skip the reducer so a moving mouse doesn't re-render the game.
      if (isCursorEvent(event)) {
        if (event.payload.playerId === userId) return;
        if (event.event === 'room.cursor-move') {
          cursors.move(event.payload.playerId, event.payload);
        } else {
          cursors.remove(event.payload.playerId);
        }
        return;
      }
      if (event.event === 'room.player-left') cursors.remove(event.payload.id);
      dispatch({ type: 'event', event });
      // The events don't carry deadlines; the snapshot does.
      if (
        event.event === 'room.round-start' ||
        event.event === 'room.time-to-judge'
      ) {
        loadDeadlines();
      }
    },
    [loadDeadlines, cursors, userId]
  );

  const handleOpen = useCallback(() => {
    fetchRoomResync(roomCode)
      .then(data => dispatch({ type: 'resync', data }))
      .catch(error => console.error('[game] resync failed', error));
  }, [roomCode]);

  const { status: connection, sendCursor } = useRoomSockets({
    roomCode,
    userId,
    onEvent: handleEvent,
    onOpen: handleOpen
  });

  useEffect(() => {
    if (!state.lastResult) return;

    const timer = setTimeout(
      () => dispatch({ type: 'dismiss-result' }),
      ROUND_RESULT_DISPLAY_MS
    );
    return () => clearTimeout(timer);
  }, [state.lastResult]);

  const value = useMemo<GameContextType>(() => {
    const currentPlayer = state.players.find(p => p.id === userId) ?? null;
    const judgeId = state.round?.judgeId ?? state.room.judgeId ?? null;
    const selectedCards = state.selectedCardIds
      .map(id => state.hand.find(card => card.id === id))
      .filter((card): card is WhiteCard => !!card);
    const pick = state.round?.blackCard?.pick ?? 0;

    return {
      ...state,
      currentPlayer,
      judgeId,
      isJudge: judgeId === userId,
      hasPlayed:
        state.room.status === 'IN_PROGRESS' && !!currentPlayer?.isReady,
      visibleHand: state.hand
        .filter(card => !state.selectedCardIds.includes(card.id))
        .sort((a, b) => a.text.localeCompare(b.text)),
      selectedCards,
      isSelectionComplete: pick > 0 && selectedCards.length === pick,
      connection,
      cursors,
      sendCursor,
      selectCard: card => dispatch({ type: 'select-card', cardId: card.id }),
      unselectCard: card =>
        dispatch({ type: 'unselect-card', cardId: card.id }),
      markCardsPlayed: cards => dispatch({ type: 'cards-played', cards }),
      dismissResult: () => dispatch({ type: 'dismiss-result' })
    };
  }, [state, userId, connection, cursors, sendCursor]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

function init(initial: RoomResync): GameState {
  return {
    room: initial.room,
    players: initial.players,
    hand: initial.hand,
    selectedCardIds: [],
    playedCards: [],
    round: roundFromSnapshot(initial.round),
    lastResult: null,
    ranking:
      initial.room.status === 'FINISHED'
        ? rankingFromPlayers(initial.players)
        : null
  };
}

export const useGame = () => {
  const ctx = useContext(GameContext);

  if (!ctx) {
    throw new Error('useGame must be used inside <GameContextProvider>');
  }

  return ctx;
};
