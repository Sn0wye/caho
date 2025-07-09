import { redirect } from 'next/navigation';
import type {
  BlackCard,
  Player,
  Room as RoomType,
  WhiteCard
} from '@caho/schemas';
import { api } from '@/utils/server/api';
import { getUser } from '@/auth/server';
import { GameContextProvider } from '@/hooks/game';
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

const getCurrentWhiteCards = async (roomCode: string) => {
  const { data } = await api.get<WhiteCard[]>(`/rooms/${roomCode}/white-cards`);

  return data;
};

const getCurrentBlackCard = async (roomCode: string) => {
  const { data } = await api.get<BlackCard>(`/rooms/${roomCode}/black-card`);

  return data;
};

export default async function GamePage({ params }: GamePageProps) {
  const roomCode = params.roomCode.toUpperCase();
  const room = await getRoom(roomCode);

  if (!room) {
    redirect('/dashboard');
  }

  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const roomPlayers = await getRoomPlayers(roomCode);
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

  const currentWhiteCards = await getCurrentWhiteCards(roomCode);
  const currentBlackCard = await getCurrentBlackCard(roomCode);

  return (
    <GameContextProvider
      initialRoom={room}
      initialPlayers={roomPlayers}
      initialCurrentPlayer={currentPlayer}
      initialWhiteCards={currentWhiteCards}
      initialBlackCard={currentBlackCard}
    >
      <Game />
    </GameContextProvider>
  );
}
