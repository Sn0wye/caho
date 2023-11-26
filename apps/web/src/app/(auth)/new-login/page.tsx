'use client';

import { type ComponentProps } from 'react';
import { type User } from '@caho/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/utils/api';

const formSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof formSchema>;

const loginService = async (payload: FormValues) => {
  const { data } = await api.post<User>('/auth/sign-in', payload);

  return data;
};

const useLogin = () => {
  return useMutation({
    mutationFn: loginService
  });
};

export default function Page() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const { mutate, isLoading } = useLogin();

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: data => {
        console.log(data);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="m-0 flex w-auto max-w-none flex-col gap-8 rounded-none bg-white p-0 text-zinc-950 shadow-none">
        <header className="flex flex-col items-stretch gap-1">
          <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
            Entrar
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            para continuar em CAHO
          </p>
        </header>

        <div className="grid grid-cols-3 gap-2">
          <button className="focus-visible:ring-ring flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 font-medium transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/80">
            <AppleIcon className="contrast-0 grayscale" />
          </button>
          <button className="focus-visible:ring-ring flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 font-medium transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/80">
            <GithubIcon className="contrast-0 grayscale" />
          </button>
          <button className="focus-visible:ring-ring flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 font-medium transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/80">
            <GoogleIcon className="contrast-0 grayscale" />
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-900"></div>
          <p className="mx-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">
            ou
          </p>
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-900"></div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-stretch justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="font-semibold">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Continuar</span>
              )}
            </Button>
          </form>
        </Form>

        <footer className="flex gap-1 text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            Não possui uma conta?
          </span>
          <a
            href="#"
            className="text-zinc-900 hover:text-zinc-900/80 hover:underline dark:text-zinc-50 dark:hover:text-zinc-50/80"
          >
            Registre-se
          </a>
        </footer>
      </div>
    </div>
  );
}

const AppleIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      {...props}
    >
      <path
        d="M17.6637 6.81868C17.5477 6.90869 15.4995 8.06281 15.4995 10.6291C15.4995 13.5974 18.1058 14.6475 18.1838 14.6735C18.1718 14.7375 17.7697 16.1116 16.8096 17.5118C15.9535 18.7439 15.0595 19.974 13.6993 19.974C12.3392 19.974 11.9892 19.1839 10.419 19.1839C8.88884 19.1839 8.34479 20 7.10067 20C5.85654 20 4.98845 18.8599 3.99035 17.4597C2.83424 15.8156 1.90015 13.2613 1.90015 10.8371C1.90015 6.9487 4.4284 4.88649 6.91665 4.88649C8.23878 4.88649 9.34089 5.75458 10.171 5.75458C10.961 5.75458 12.1932 4.83448 13.6973 4.83448C14.2674 4.83448 16.3156 4.88649 17.6637 6.81868ZM12.9833 3.18832C13.6053 2.45025 14.0454 1.42614 14.0454 0.40204C14.0454 0.260026 14.0334 0.116012 14.0074 0C12.9953 0.0380038 11.7911 0.674068 11.0651 1.51615C10.495 2.16422 9.96295 3.18832 9.96295 4.22642C9.96295 4.38244 9.98895 4.53845 10.001 4.58846C10.065 4.60046 10.169 4.61446 10.273 4.61446C11.1811 4.61446 12.3232 4.0064 12.9833 3.18832Z"
        fill="black"
      />
    </svg>
  );
};

const GithubIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height="1.25em"
      viewBox="0 0 1024 1024"
      width="1.25em"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        fill="#1B1F23"
        fillRule="evenodd"
        transform="scale(64)"
      />
    </svg>
  );
};

const GoogleIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height="1.25em"
      viewBox="0 0 600 600"
      width="1.25em"
      {...props}
    >
      <path
        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
        fill="#4285f4"
      />
      <path
        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
        fill="#34a853"
      />
      <path
        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
        fill="#fbbc04"
      />
      <path
        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
        fill="#ea4335"
      />
    </svg>
  );
};
