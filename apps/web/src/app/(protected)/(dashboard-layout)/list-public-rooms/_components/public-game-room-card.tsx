'use client';

import { useRouter } from 'next/navigation';
import type {
  JoinRoomRequest,
  JoinRoomResponse,
  ListPublicRoomsResponse
} from '@caho/contracts';
import type { ErrorSchema } from '@caho/schemas';
import { useMutation } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';

type PublicGameRoomCardProps = ListPublicRoomsResponse[number];

const joinRoom = async (
  payload: JoinRoomRequest
): Promise<JoinRoomResponse> => {
  try {
    const { data } = await api.post<JoinRoomResponse>('/rooms/join', payload);
    return data;
  } catch (error) {
    throw error.response.data as ErrorSchema;
  }
};

export function PublicGameRoomCard({
  code,
  maxPlayers,
  maxPoints,
  playerCount,
  hostUsername
}: PublicGameRoomCardProps) {
  const router = useRouter();

  const { mutate } = useMutation<
    JoinRoomResponse,
    ErrorSchema,
    JoinRoomRequest
  >(joinRoom, {
    mutationKey: ['join-room']
  });

  function handleJoinRoom() {
    mutate(
      { roomCode: code, password: null },
      {
        onSuccess: data => {
          router.push(`/room/${data.code.toUpperCase()}`);
        },
        onError: error => {
          toast({
            variant: 'destructive',
            title: 'Erro ao entrar na sala',
            description: error.message
          });
        }
      }
    );
  }

  return (
    <Card
      onClick={handleJoinRoom}
      className="transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900"
    >
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between gap-2">
          <span>Sala</span>
          <div className="flex items-center gap-1">
            <Hash size={16} className="text-geist-orange" />
            <span className="font-mono text-lg font-bold leading-none">
              {code}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <PublicGameRoomCardData
          label="jogadores"
          value={`${playerCount}/ ${maxPlayers}`}
        />
        <PublicGameRoomCardData label="pontos para acabar" value={maxPoints} />
        <PublicGameRoomCardData label="host" value={hostUsername} />
      </CardContent>
    </Card>
  );
}

function PublicGameRoomCardData({
  label,
  value
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
        {label}:
      </span>
      <span className="text-zinc-500 dark:text-zinc-400">{value}</span>
    </div>
  );
}
