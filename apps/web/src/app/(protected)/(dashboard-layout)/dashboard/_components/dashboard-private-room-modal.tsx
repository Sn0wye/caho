'use client';

import { Noise } from '@/components/illustrations/noise';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
import '@caho/contracts';
import { useRouter } from 'next/navigation';
import {
  joinRoomRequest,
  JoinRoomRequest,
  JoinRoomResponse
} from '@caho/contracts';
import type { ErrorSchema } from '@caho/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DashboardOptionCard } from './dashboard-option-card';

export const joinRoom = async (
  payload: JoinRoomRequest
): Promise<JoinRoomResponse> => {
  try {
    const { data } = await api.post<JoinRoomResponse>('/rooms/join', payload);
    return data;
  } catch (error) {
    throw error.response.data as ErrorSchema;
  }
};

export function DashboardPrivateRoomModal() {
  const { push } = useRouter();

  const form = useForm<JoinRoomRequest>({
    resolver: zodResolver(joinRoomRequest),
    defaultValues: {
      roomCode: '',
      password: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: joinRoom,
    onSuccess: data => {
      push(`/room/${data.code}`);
    },
    onError: (error: ErrorSchema) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar na sala',
        description: error.message
      });
    }
  });

  function onSubmit(values: JoinRoomRequest) {
    mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DashboardOptionCard
          as="button"
          title="Tenho um código"
          description="Meus amiguinhos já estão me esperando na sala. Vou entrar com o código!"
          bgColor="purple"
          icon={<Lock />}
        />
      </DialogTrigger>
      <DialogContent className="flex max-w-2xl gap-8 p-8">
        <figure className="relative flex w-full overflow-clip rounded-md bg-linear-to-tr from-zinc-100 from-30% via-slate-200 to-slate-400 p-5 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-700">
          <Noise className="rounded-md" />

          <div className="flex flex-col gap-1 self-end">
            <Lock size={24} className="mb-4" />
            <h2 className="text-2xl font-normal text-zinc-600 dark:text-zinc-400">
              Sala
              <span className="font-semibold text-zinc-950 dark:text-zinc-200">
                {' '}
                privada!
              </span>
            </h2>
            <span className="text-sm text-zinc-400 dark:text-zinc-400">
              As vezes é melhor jogar com os amigos, não é mesmo?
            </span>
          </div>
        </figure>

        <div className="max-w-[50%] space-y-8 pb-4">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              Entrar com um código
            </DialogTitle>
            <DialogDescription>
              Uma sala privada necessita de um código e senha, peça para o seu
              amigo te passar!
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="roomCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-px">
                      <FormLabel className="text-zinc-700 dark:text-zinc-300">
                        Código da sala:
                      </FormLabel>
                      <FormDescription>
                        Digite o código de 6 dígitos.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Senha:
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mb-2 w-full"
                disabled={isPending}
              >
                {isPending ? 'Validando...' : 'Validar código'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
