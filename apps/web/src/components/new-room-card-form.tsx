'use client';

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
import { Switch } from '@/components/ui/switch';
import { NEW_ROOM_FORM } from '@/constants/room';
import { api } from '@/utils/api';
import { createRoom, type CreateRoom } from '@caho/contracts';
import { type Player, type Room } from '@caho/schemas';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectTrigger } from '@radix-ui/react-select';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, Lock, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { Select, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from './ui/use-toast';

const formSchema = createRoom.omit({
  players: true,
  hostId: true,
  isHost: true
});

type FormSchema = z.infer<typeof formSchema>;

const createRoomMutation = async (data: CreateRoom) => {
  const { data: room } = await api.post<Room>('/rooms/create', data);

  return room;
};

export const NewRoomCardForm = () => {
  const { mutate, isLoading } = useMutation(createRoomMutation);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      maxPlayers: 2,
      isPublic: false
    }
  });
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    if (!user) return;

    const player: Player = {
      avatarUrl: user.imageUrl,
      id: user.id,
      isHost: true,
      score: 0,
      username: user.fullName || user.username || 'Anônimo'
    };

    const payload = {
      ...values,
      players: [player],
      hostId: user.id
    };

    console.log(payload);

    mutate(payload, {
      onSuccess: room => {
        router.push(`/room/${room.code}`);
      },
      onError: () => {
        //TODO: type error
        toast({
          description: 'Erro!',
          variant: 'destructive'
        });
      }
    });
  };

  const isPublic = form.watch('isPublic');

  return (
    <section className="flex flex-col gap-10">
      <div className="space-y-0.5">
        <h1 className="text-xl font-semibold text-secondary-foreground">
          Configurações da sala
        </h1>
        <span className="text-sm text-muted-foreground">
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
                  <Users size={18} className="shrink-0 text-primary" />

                  <div>
                    <FormLabel>
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
                  <Trophy size={18} className="shrink-0 text-primary" />
                  <div>
                    <FormLabel>
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
                      if (isNaN(Number(e.target.value))) return;

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

          <div className="rounded-md border p-4 border-border">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex w-full flex-row items-center justify-between space-x-3">
                  <div className="flex items-center gap-4">
                    {isPublic ? (
                      <Eye size={18} className="shrink-0 text-primary" />
                    ) : (
                      <EyeOff size={18} className="shrink-0 text-primary" />
                    )}
                    <div>
                      <FormLabel>
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
                      <Lock size={18} className="shrink-0 text-primary" />
                      <div>
                        <FormLabel>
                          Senha:
                        </FormLabel>
                        <FormDescription>
                          Por mais que seja só um jogo, evite colocar uma senha
                          óbvia. Ninguém quer ter sua sala invadida, né?
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
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
          <Button type="submit">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Criar sala!'
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};
