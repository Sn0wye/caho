'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getApiErrorMessage, leaveRoom } from '@/utils/game-api';
import { useGame } from '@/hooks/game';

export function GameLeaveButton() {
  const router = useRouter();
  const { room, currentPlayer } = useGame();
  const isHostInLobby =
    room.status === 'LOBBY' && room.hostId === currentPlayer?.id;

  const { mutate, isPending } = useMutation({
    mutationFn: () => leaveRoom(room.code),
    onSuccess: () => router.push('/dashboard'),
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Não deu pra sair da sala',
        description: getApiErrorMessage(error)
      });
    }
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sair da sala</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vai arregar mesmo?</AlertDialogTitle>
          <AlertDialogDescription>
            {isHostInLobby
              ? 'Você é o host: se sair agora, a sala fecha para todo mundo.'
              : 'Sair apaga seus pontos nesta sala. Dá pra entrar de novo com o código, mas começando do zero.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ficar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
            Sair da sala
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
