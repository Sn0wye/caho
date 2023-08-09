'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectTrigger } from '@radix-ui/react-select';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { api } from '@/utils/api';
import { type Player } from '@/server/schemas/player';
import {
  createRoomFormSchema,
  type CreateRoomFormSchema
} from '@/server/schemas/room';
import { Select, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from './ui/use-toast';

export const NewGameCardForm = () => {
  const { mutate, isLoading } = api.room.new.useMutation();

  const form = useForm<CreateRoomFormSchema>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      password: '',
      maxPlayers: 2,
      isPublic: false
    }
  });
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (values: CreateRoomFormSchema) => {
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

    mutate(payload, {
      onSuccess: data => {
        router.push(data.redirect);
      },
      onError: e => {
        toast({
          description: e.message,
          variant: 'destructive'
        });
      }
    });
  };

  const isPublic = form.watch('isPublic');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações dessa bagaça</CardTitle>
        <CardDescription>
          Se divertir sem pensar muito em configurações e blah blah blah...
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, e => console.log(e))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de jogadores:</FormLabel>
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
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
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
                  <FormLabel>Pontos para ganhar:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={String(field.value)}
                      onChange={v => {
                        if (isNaN(Number(v.target.value))) return;

                        return field.onChange(Number(v.target.value));
                      }}
                      type="number"
                      placeholder="Com quantos pontos a festa acaba?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" border border-zinc-200 p-4 dark:border-zinc-800">
              {/* TODO: Display the Password field */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center justify-between space-x-3">
                    <div className="space-y-1.5 leading-none">
                      <FormLabel>Deixar a sala pública?</FormLabel>
                      <FormDescription>
                        Uma sala pública pode ser encontrada por qualquer pessoa
                        que esteja procurando por uma sala.
                      </FormDescription>
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

              {!isPublic && <Separator className="my-6" />}

              {!isPublic && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha para entrar:</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ideia de senha: número do cartão de crédito e CVV 🎉"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>(opcional)</FormDescription>
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
                ' FINALMENTE! BORA?!'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
