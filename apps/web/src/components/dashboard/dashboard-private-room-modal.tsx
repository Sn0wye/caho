'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { RoomCodeInput } from '../room-code-input';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { DashboardOptionCard } from './dashboard-option-card';

const formSchema = z.object({
  roomCode: z
    .string()
    .min(6)
    .max(6)
    .regex(/^[\d\w]+$/)
});

export function DashboardPrivateRoomModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomCode: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DashboardOptionCard
          as="button"
          title="Tenho um código"
          description="Meus amiguinhos já estão me esperando na sala. Vou entrar com o código!"
          icon={<Lock />}
        />
      </DialogTrigger>
      <DialogContent className="flex max-w-2xl gap-8 p-8">
        <figure className="flex w-full overflow-clip rounded-md bg-gradient-to-tr from-accent/10 from-50% to-accent p-5">
          <div className="flex flex-col gap-1 self-end">
            <Lock size={24} className="mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-normal text-muted-foreground opacity-80">
              Sala
              <span className="font-semibold text-secondary-foreground">
                {' '}
                privada!
              </span>
            </h2>
            <span className="text-sm text-muted-foreground opacity-60">
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
              Uma sala privada necessita de um código secreto, peça para o seu
              amigo te passar!
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="roomCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-px">
                      <FormLabel>
                        Código da sala:
                      </FormLabel>
                      <FormDescription>
                        Digite o código de 6 dígitos.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <RoomCodeInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mb-2 w-full">
                Validar código
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
