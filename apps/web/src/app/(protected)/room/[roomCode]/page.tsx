import { redirect } from 'next/navigation';
import type { Player, Room as RoomType } from '@caho/schemas';
import { api } from '@/utils/server/api';
import { getUser } from '@/auth/server';
import { Game } from './game';

type GamePageProps = {
  params: {
    roomCode: string;
  };
};

const getRoom = async (roomCode: string) => {
  const { data } = await api.get<RoomType>(`/rooms/${roomCode}`);

  return data;
};

const getRoomPlayers = async (roomCode: string) => {
  const { data } = await api.get<Player[]>(`/rooms/${roomCode}/players`);

  return data;
};
export default async function GamePage({ params }: GamePageProps) {
  const room = await getRoom(params.roomCode);

  if (!room) {
    redirect('/dashboard');
  }

  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const roomPlayers = await getRoomPlayers(params.roomCode);
  const currentPlayer = roomPlayers.find(player => player.id === user.id);

  if (!currentPlayer) {
    throw new Error('Current player not found');
  }

  // TODO: review this logic
  const userIsInRoom = roomPlayers.some(player => player.id === user?.id);

  if (!userIsInRoom) {
    //TODO: verify connection, etc
    redirect('/dashboard');
  }

  return (
    <Game room={room} players={roomPlayers} currentPlayer={currentPlayer} />
  );
}
