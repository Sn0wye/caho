'use client';

import { useRouter } from 'next/navigation';
import { createRoom, type CreateRoom } from '@caho/contracts';
import type { Room } from '@caho/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, Lock, Trophy, Users } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
import { useAuth } from '@/auth/client';
import { NEW_ROOM_FORM } from '@/constants/room';

const formSchema = createRoom;

type FormSchema = z.infer<typeof formSchema>;

const createRoomMutation = async (data: CreateRoom) => {
  const { data: room } = await api.post<Room>('/rooms/create', data);

  return room;
};

// TODO: client component hook for getting user
export const NewRoomCardForm = () => {
  const { mutate, isLoading } = useMutation(createRoomMutation);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      maxPlayers: 2,
      maxPoints: 10,
      isPublic: false
    }
  });

  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    if (!user) return;

    mutate(
      {
        isPublic: values.isPublic,
        maxPlayers: values.maxPlayers,
        maxPoints: values.maxPoints,
        password: values.password
      },
      {
        onSuccess: room => {
          router.push(`/room/${room.code}`);
        },
        onError: () => {
          toast({
            description: 'Erro!',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const isPublic = form.watch('isPublic');

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
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex w-full flex-row items-center justify-between space-x-3">
                  <div className="flex items-center gap-4">
                    {isPublic ? (
                      <Eye size={18} className="shrink-0 text-zinc-500" />
                    ) : (
                      <EyeOff size={18} className="shrink-0 text-zinc-500" />
                    )}
                    <div>
                      <FormLabel className="text-zinc-700 dark:text-zinc-300">
                        Deixar a sala pública?
                      </FormLabel>
                      <FormDescription>
                        Uma sala pública pode ser encontrada por qualquer pessoa
                        que esteja procurando por uma sala.
                      </FormDescription>
                    </div>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isPublic && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="ml-7">
                    <Separator className="mb-4 mt-6" />
                    <div className="flex items-center gap-4">
                      <Lock size={18} className="shrink-0 text-zinc-500" />
                      <div>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Senha:
                        </FormLabel>
                        <FormDescription>
                          Por mais que seja só um jogo, evite colocar uma senha
                          óbvia. Ninguém quer ter sua sala invadida, né?
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      {/* TODO: fix this */}
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/** @ts-ignore  */}
                      <Input
                        type="password"
                        placeholder="Ideia de senha: número do cartão de crédito e CVV"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/*
           * TODO: Display the Start Game button
           * Empty: Nem preencher você sabe, hein!
           * ERROR: Acho que você errou alguma coisa aí, hein?
           * VALIDATING: Validando...
           * VALID: FINALMENTE! BORA?!
           */}
          <footer className="flex items-center justify-end">
            <Button type="submit">
              {isLoading ? (
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
