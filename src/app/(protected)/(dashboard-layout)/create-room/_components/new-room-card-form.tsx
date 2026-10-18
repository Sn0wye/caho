'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Lock, Trophy, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/game-api';
import { useAuth } from '@/auth/client';
import { NEW_ROOM_FORM } from '@/constants/room';
import { createRoom, type CreateRoom } from '@/contracts';
import type { SanitizedRoom } from '@/schemas';

const formSchema = createRoom;

type FormSchema = z.infer<typeof formSchema>;

const createRoomMutation = async (data: CreateRoom) => {
  const { data: room } = await api.post<SanitizedRoom>('/rooms/create', data);

  return room;
};

// TODO: client component hook for getting user
export const NewRoomCardForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createRoomMutation
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      maxPlayers: NEW_ROOM_FORM.MIN_PLAYERS,
      maxPoints: 10
    }
  });

  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    if (!user) return;

    mutate(
      {
        maxPlayers: values.maxPlayers,
        maxPoints: values.maxPoints,
        // An empty field means no password: the Room is open to anyone.
        password: values.password || null
      },
      {
        onSuccess: room => {
          router.push(`/room/${room.code}`);
        },
        onError: error => {
          toast({
            title: 'Não deu pra criar a sala',
            description: getApiErrorMessage(error),
            variant: 'destructive'
          });
        }
      }
    );
  };

  return (
    <section className="flex flex-col gap-10">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          Configurações da sala
        </h1>
        <span className="text-sm text-zinc-500">
          Comece a se divertir sem pensar muito! Fique tranquilo, você pode
          mudar essas configurações depois.
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, e => console.log(e))}
          className="space-y-10"
        >
          <FormField
            control={form.control}
            name="maxPlayers"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-4">
                  <Users size={18} className="shrink-0 text-zinc-500" />

                  <div>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Máximo de jogadores:
                    </FormLabel>
                    <FormDescription>
                      Comece a se divertir sem pensar muito! Fique tranquilo,
                      você pode mudar essas configurações depois.
                    </FormDescription>
                  </div>
                </div>
                <Select
                  onValueChange={v => field.onChange(Number(v))}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Qual o tamanho do coração?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(
                      {
                        length:
                          NEW_ROOM_FORM.MAX_PLAYERS -
                          NEW_ROOM_FORM.MIN_PLAYERS +
                          1
                      },
                      (_, i) => i + NEW_ROOM_FORM.MIN_PLAYERS
                    ).map(value => (
                      <SelectItem key={value} value={String(value)}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxPoints"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-4">
                  <Trophy size={18} className="shrink-0 text-zinc-500" />
                  <div>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Pontos para ganhar:
                    </FormLabel>
                    <FormDescription>
                      Recomendamos valores entre 10 a 30 pontos. Acima disto sua
                      partida será tão longa quanto à escravatura no Brasil.
                    </FormDescription>
                  </div>
                </div>

                <FormControl>
                  <Input
                    {...field}
                    value={String(field.value)}
                    onChange={e => {
                      if (Number.isNaN(Number(e.target.value))) return;

                      return field.onChange(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="Com quantos pontos a festa acaba?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-900">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <Lock size={18} className="shrink-0 text-zinc-500" />
                    <div>
                      <FormLabel className="text-zinc-700 dark:text-zinc-300">
                        Senha:
                      </FormLabel>
                      <FormDescription>
                        Opcional. Toda sala aparece na lista de partidas; com
                        senha, só entra quem souber. Deixe vazio pra sala
                        aberta.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ideia de senha: número do cartão de crédito e CVV"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/*
           * TODO: Display the Start Game button
           * Empty: Nem preencher você sabe, hein!
           * ERROR: Acho que você errou alguma coisa aí, hein?
           * VALIDATING: Validando...
           * VALID: FINALMENTE! BORA?!
           */}
          <footer className="flex items-center justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Criar sala!'
              )}
            </Button>
          </footer>
        </form>
      </Form>
    </section>
  );
};
