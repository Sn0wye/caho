'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Noise } from '../illustrations/noise';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { DashboardOptionCard } from './dashboard-option-card';

const formSchema = z.object({
  roomCode: z.string().min(6, {
    message: 'O código da sala deve ter 6 dígitos.'
  })
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
          bgColor="purple"
          icon={<Lock />}
        />
      </DialogTrigger>
      <DialogContent className="flex max-w-2xl gap-8 p-8">
        <figure className="relative flex w-full overflow-clip rounded-md bg-gradient-to-tr from-zinc-100 from-30% via-slate-200 to-slate-400 p-5 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-700">
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
