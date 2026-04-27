'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AxiosError } from 'axios';
import { parse } from 'cookie';
import { createServerAction } from 'zsa';
import { api } from '@/utils/api';
import { signInRequest, type SignUpResponse } from '@/contracts';

export const registerAction = createServerAction()
  .input(signInRequest)
  .onSuccess(async () => {
    redirect('/dashboard');
  })
  .handler(async ({ input }) => {
    try {
      const { data, headers } = await api.post<SignUpResponse>(
        '/auth/sign-up',
        input
      );

      if (headers['set-cookie']) {
        const cookie = parse(headers['set-cookie'][0]) as {
          auth_session: string;
          Expires: string;
        };

        cookies().set({
          name: 'auth_session',
          value: cookie.auth_session,
          expires: new Date(cookie.Expires),
          path: '/',
          httpOnly: true,
          sameSite: 'lax'
        });
      }
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw e.response?.data.message;
      }

      throw e.response?.data;
    }
  });
