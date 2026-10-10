import { AxiosError } from 'axios';
import { api } from '@/utils/api';
import type {
  RoomPlayer,
  RoundSnapshot,
  SanitizedRoom,
  WhiteCard
} from '@/schemas';

// Client-side game commands. State changes come back over the WebSocket; these
// only send the command and surface the backend's error message on failure.

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return 'Algo deu errado. Tente novamente.';
}

export async function toggleReady(roomCode: string) {
  await api.post(`/rooms/${roomCode}/ready`);
}

export async function startGame(roomCode: string) {
  await api.post('/rooms/start', { roomCode });
}

export async function playCards(roomCode: string, cardIds: string[]) {
  await api.post(`/rooms/${roomCode}/play-cards`, cardIds);
}

export async function pickWinner(roomCode: string, winnerPlayerId: string) {
  await api.post(`/rooms/${roomCode}/winner`, { winnerPlayerId });
}

export async function leaveRoom(roomCode: string) {
  await api.post('/rooms/leave', { roomCode });
}

export async function endGame(roomCode: string) {
  await api.post('/rooms/end', { roomCode });
}

export type RoomResync = {
  room: SanitizedRoom;
  players: RoomPlayer[];
  hand: WhiteCard[];
  round: RoundSnapshot | null;
};

// Events are live deltas only, so after a reconnect the client reloads the
// whole Room to catch up on anything it missed while offline.
export async function fetchRoomResync(roomCode: string): Promise<RoomResync> {
  const [room, players, hand, round] = await Promise.all([
    api.get<SanitizedRoom>(`/rooms/${roomCode}`),
    api.get<RoomPlayer[]>(`/rooms/${roomCode}/players`),
    api.get<WhiteCard[]>(`/rooms/${roomCode}/white-cards`),
    api.get<RoundSnapshot | null>(`/rooms/${roomCode}/round`)
  ]);

  return {
    room: room.data,
    players: players.data,
    hand: hand.data ?? [],
    round: round.data || null
  };
}

export async function fetchRoundSnapshot(roomCode: string) {
  const { data } = await api.get<RoundSnapshot | null>(
    `/rooms/${roomCode}/round`
  );

  return data || null;
}
