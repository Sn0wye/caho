'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface SettingsProfileFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
  };
}

const profileFormSchema = z.object({
  avatar: z.any(),
  firstName: z.string(),
  lastName: z.string()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function SettingsProfileForm({ user }: SettingsProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? ''
    }
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <div className="flex items-center gap-6">
                  <input
                    type="file"
                    className="sr-only"
                    onChange={field.onChange}
                    ref={field.ref}
                    name={field.name}
                    id={field.name}
                  />

                  <label
                    htmlFor={field.name}
                    className="cursor-pointer hover:opacity-70"
                  >
                    <Image
                      src={user.imageUrl}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full bg-primary/10"
                    />
                  </label>
                  <div>
                    <span className="text-lg font-medium">Sua foto de perfil</span>
                    <p className="text-sm text-muted-foreground">
                      Clique na imagem para alterar sua foto de perfil.
                    </p>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primeiro nome</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Atualizar</Button>
      </form>
    </Form>
  );
}
