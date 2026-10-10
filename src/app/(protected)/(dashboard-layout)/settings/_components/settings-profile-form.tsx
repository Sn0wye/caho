'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { api } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/game-api';
import { useAuth } from '@/auth/client';
import type { UpdateProfileRequest, UpdateProfileResponse } from '@/contracts';

// Inputs always hold strings; empty ones become null on submit.
const profileFormSchema = z.object({
  avatarUrl: z.union([
    z.literal(''),
    z.string().trim().url('Informe uma URL válida.')
  ]),
  email: z.union([
    z.literal(''),
    z.string().trim().email('Informe um email válido.')
  ]),
  username: z.string().trim().min(1, 'Informe um nome de usuário.').max(255)
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

async function updateProfile(values: ProfileFormValues) {
  const payload: UpdateProfileRequest = {
    avatarUrl: values.avatarUrl || null,
    email: values.email || null,
    username: values.username
  };

  const { data } = await api.post<UpdateProfileResponse>(
    '/auth/profile',
    payload
  );

  return data;
}

export function SettingsProfileForm() {
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      avatarUrl: user?.avatarUrl ?? '',
      email: user?.email ?? '',
      username: user?.username ?? ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: updated => {
      form.reset({
        avatarUrl: updated.avatarUrl ?? '',
        email: updated.email ?? '',
        username: updated.username
      });
      toast({ title: 'Perfil atualizado' });
      // The user comes from the server layout; refresh so nav and avatar match.
      router.refresh();
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar perfil',
        description: getApiErrorMessage(error)
      });
    }
  });

  const avatarUrl = form.watch('avatarUrl');
  const username = form.watch('username');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => mutate(values))}
        className="space-y-8"
      >
        <Card>
          <CardContent className="flex items-center gap-6 p-6">
            <Avatar>
              <AvatarImage src={avatarUrl || undefined} alt="Seu avatar" />
              <AvatarFallback>
                {username.slice(0, 1).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>URL do avatar</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
