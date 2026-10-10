import { notFound, redirect } from 'next/navigation';
import { AxiosError } from 'axios';
import { JoinRoomPrompt } from '@/components/game/join/join-room-prompt';
import { api } from '@/utils/server/api';
import { getUser } from '@/auth/server';
import { GameContextProvider } from '@/hooks/game';
import type {
  RoomPlayer,
  RoundSnapshot,
  SanitizedRoom,
  WhiteCard
} from '@/schemas';
import { Game } from './game';

type GamePageProps = {
  params: Promise<{
    roomCode: string;
  }>;
};

const getRoom = async (roomCode: string) => {
  try {
    const { data } = await api.get<SanitizedRoom>(`/rooms/${roomCode}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

const getRoomPlayers = async (roomCode: string) => {
  const { data } = await api.get<RoomPlayer[]>(`/rooms/${roomCode}/players`);
  return data;
};

const getHand = async (roomCode: string) => {
  const { data } = await api.get<WhiteCard[]>(`/rooms/${roomCode}/white-cards`);
  return data ?? [];
};

const getRound = async (roomCode: string) => {
  const { data } = await api.get<RoundSnapshot | null>(
    `/rooms/${roomCode}/round`
  );
  return data || null;
};

export default async function GamePage({ params }: GamePageProps) {
  const roomCode = (await params).roomCode.toUpperCase();

  if (roomCode.length !== 6) {
    notFound();
  }

  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const room = await getRoom(roomCode);

  if (!room) {
    redirect('/dashboard');
  }

  const players = await getRoomPlayers(roomCode);
  const isMember = players.some(player => player.id === user.id);

  if (!isMember) {
    return (
      <JoinRoomPrompt
        room={room}
        playerCount={players.length}
        hostName={players.find(player => player.isHost)?.username ?? null}
      />
    );
  }

  const [hand, round] = await Promise.all([
    getHand(roomCode),
    getRound(roomCode)
  ]);

  return (
    <GameContextProvider
      userId={user.id}
      initialState={{ room, players, hand, round }}
    >
      <Game />
    </GameContextProvider>
  );
}
