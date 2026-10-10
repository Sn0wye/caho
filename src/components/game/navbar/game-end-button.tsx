'use client';

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
import { endGame, getApiErrorMessage } from '@/utils/game-api';
import { useGame } from '@/hooks/game';

// Host only. The final Ranking arrives for everyone via `room.game-end`.
export function GameEndButton() {
  const { room } = useGame();

  const { mutate, isPending } = useMutation({
    mutationFn: () => endGame(room.code),
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Não deu pra encerrar a partida',
        description: getApiErrorMessage(error)
      });
    }
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">Encerrar partida</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Encerrar a partida agora?</AlertDialogTitle>
          <AlertDialogDescription>
            O jogo acaba para todo mundo e o ranking atual vira o resultado
            final.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar jogando</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
            Encerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
