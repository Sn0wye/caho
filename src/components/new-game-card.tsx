'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { createRoomSchema, type CreateRoomSchema } from '@/server/schemas/room';

export const NewGameCard = () => {
  const form = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      password: '',
      maxPlayers: 2,
      isPublic: true
    }
  });

  function onSubmit(values: CreateRoomSchema) {
    console.log(values);
    toast({
      description: 'Jogo criado!'
    });
  }

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de jogadores:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Qual o tamanho do coração?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Público:</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
