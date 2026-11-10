import type { RoomResync } from '@/utils/game-api';
import type { PlayerEvent, RoomEvent } from '@/contracts';
import type {
  BlackCard,
  Ranking,
  RoomPlayer,
  RoundPlayedCard,
  RoundSnapshot,
  RoundStatus,
  SanitizedRoom,
  WhiteCard
} from '@/schemas';

export type GameRound = {
  number: number;
  status: RoundStatus;
  judgeId: string;
  blackCard: BlackCard | null;
  playedCards: RoundPlayedCard[];
  playDeadline: Date | null;
  judgeDeadline: Date | null;
};

type RoundEndPayload = Extract<
  RoomEvent,
  { event: 'room.round-end' }
>['payload'];

// The next `room.round-start` replaces the Black Card right away, so the result
// keeps its own copy to show the winning sentence.
export type RoundResult = RoundEndPayload & { blackCard: BlackCard | null };

export type GameState = {
  room: SanitizedRoom;
  players: RoomPlayer[];
  // The full Hand; `selectedCardIds` marks the ones placed on the Black Card.
  hand: WhiteCard[];
  selectedCardIds: string[];
  // What this Player submitted this Round; the refilled Hand no longer has it.
  playedCards: WhiteCard[];
  round: GameRound | null;
  lastResult: RoundResult | null;
  ranking: Ranking | null;
};

export type GameAction =
  | { type: 'event'; event: RoomEvent | PlayerEvent }
  | { type: 'resync'; data: RoomResync }
  | { type: 'deadlines'; snapshot: RoundSnapshot }
  | { type: 'select-card'; cardId: string }
  | { type: 'unselect-card'; cardId: string }
  | { type: 'cards-played'; cards: WhiteCard[] }
  | { type: 'dismiss-result' };

export function roundFromSnapshot(
  snapshot: RoundSnapshot | null
): GameRound | null {
  if (!snapshot) {
    return null;
  }

  return {
    number: snapshot.roundNumber,
    status: snapshot.status,
    judgeId: snapshot.judgeId,
    blackCard: snapshot.blackCard,
    playedCards: snapshot.roundPlayedCards,
    playDeadline: toDate(snapshot.playDeadline),
    judgeDeadline: toDate(snapshot.judgeDeadline)
  };
}

// Rankings only exist on the wire at game end; a FINISHED Room loaded over REST
// rebuilds one from the Players' scores.
export function rankingFromPlayers(players: RoomPlayer[]): Ranking {
  return [...players]
    .sort((a, b) => b.score - a.score)
    .map(({ id, username, avatarUrl, score }) => ({
      id,
      username,
      avatarUrl,
      score
    }));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'event':
      return applyEvent(state, action.event);
    case 'resync':
      return applyResync(state, action.data);
    case 'deadlines':
      return applyDeadlines(state, action.snapshot);
    case 'select-card':
      return selectCard(state, action.cardId);
    case 'unselect-card':
      return {
        ...state,
        selectedCardIds: state.selectedCardIds.filter(
          id => id !== action.cardId
        )
      };
    case 'cards-played':
      return { ...state, playedCards: action.cards };
    case 'dismiss-result':
      return { ...state, lastResult: null };
  }
}

function applyEvent(
  state: GameState,
  { event, payload }: RoomEvent | PlayerEvent
): GameState {
  switch (event) {
    case 'room.started':
      return {
        ...state,
        room: payload.room,
        players: payload.players,
        ranking: null
      };
    case 'room.player-joined':
    case 'room.player-update':
      return upsertPlayer(state, payload);
    case 'room.player-left':
      return {
        ...state,
        players: state.players.filter(player => player.id !== payload.id)
      };
    case 'room.round-start':
      return startRound(state, payload);
    case 'room.time-to-judge':
      return openJudging(state, payload);
    case 'room.round-end':
      return endRound(state, payload);
    case 'room.game-end':
      return {
        ...state,
        room: { ...state.room, status: 'FINISHED' },
        ranking: payload
      };
    case 'player.cards-drawn':
      return replaceHand(state, payload);
    // GameContextProvider routes cursors to the CursorStore instead.
    case 'room.cursor-move':
    case 'room.cursor-leave':
      return state;
  }
}

function upsertPlayer(state: GameState, player: RoomPlayer): GameState {
  const exists = state.players.some(p => p.id === player.id);
  const upserted = exists
    ? state.players.map(p => (p.id === player.id ? player : p))
    : [...state.players, player];
  // On a Host hand-over the backend only broadcasts the new Host, so drop the
  // flag from whoever held it before.
  const players = player.isHost
    ? upserted.map(p => (p.id === player.id ? p : { ...p, isHost: false }))
    : upserted;
  const hostId = player.isHost ? player.id : state.room.hostId;

  return { ...state, players, room: { ...state.room, hostId } };
}

function startRound(
  state: GameState,
  payload: { roundNumber: number; judgeId: string; blackCard: BlackCard }
): GameState {
  return {
    ...state,
    room: {
      ...state.room,
      status: 'IN_PROGRESS',
      round: payload.roundNumber,
      judgeId: payload.judgeId
    },
    // Mid-game `isReady` means "played this Round"; every Round starts fresh.
    players: state.players.map(player => ({ ...player, isReady: false })),
    selectedCardIds: [],
    playedCards: [],
    round: {
      number: payload.roundNumber,
      status: 'PLAYING',
      judgeId: payload.judgeId,
      blackCard: payload.blackCard,
      playedCards: [],
      playDeadline: null,
      judgeDeadline: null
    }
  };
}

function openJudging(
  state: GameState,
  payload: { roundNumber: number; roundPlayedCards: RoundPlayedCard[] }
): GameState {
  if (!state.round || state.round.number !== payload.roundNumber) {
    return state;
  }

  return {
    ...state,
    round: {
      ...state.round,
      status: 'JUDGING',
      playedCards: payload.roundPlayedCards
    }
  };
}

function endRound(state: GameState, result: RoundEndPayload): GameState {
  const players = state.players.map(player =>
    player.id === result.winnerId && result.newScore !== null
      ? { ...player, score: result.newScore }
      : player
  );
  const isCurrentRound = state.round?.number === result.roundNumber;
  const round =
    state.round && isCurrentRound
      ? {
          ...state.round,
          status: result.reason === 'picked' ? 'COMPLETE' : 'ABORTED'
        }
      : state.round;

  return {
    ...state,
    players,
    lastResult: {
      ...result,
      blackCard: isCurrentRound ? (state.round?.blackCard ?? null) : null
    },
    round: round as GameRound | null
  };
}

function replaceHand(state: GameState, hand: WhiteCard[]): GameState {
  const handIds = new Set(hand.map(card => card.id));

  return {
    ...state,
    hand,
    selectedCardIds: state.selectedCardIds.filter(id => handIds.has(id))
  };
}

function selectCard(state: GameState, cardId: string): GameState {
  const pick = state.round?.blackCard?.pick ?? 0;
  const alreadySelected = state.selectedCardIds.includes(cardId);

  if (alreadySelected || state.selectedCardIds.length >= pick) {
    return state;
  }

  return { ...state, selectedCardIds: [...state.selectedCardIds, cardId] };
}

function applyResync(state: GameState, data: RoomResync): GameState {
  const synced = replaceHand(
    {
      ...state,
      room: data.room,
      players: data.players,
      round: roundFromSnapshot(data.round)
    },
    data.hand
  );

  const ranking =
    data.room.status === 'FINISHED'
      ? (state.ranking ?? rankingFromPlayers(data.players))
      : null;

  return { ...synced, ranking };
}

function applyDeadlines(state: GameState, snapshot: RoundSnapshot): GameState {
  if (!state.round || state.round.number !== snapshot.roundNumber) {
    return state;
  }

  return {
    ...state,
    round: {
      ...state.round,
      playDeadline: toDate(snapshot.playDeadline),
      judgeDeadline: toDate(snapshot.judgeDeadline)
    }
  };
}

function toDate(value: Date | string | null): Date | null {
  return value ? new Date(value) : null;
}
