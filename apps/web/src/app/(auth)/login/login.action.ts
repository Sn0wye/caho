'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SignInRequest, SignInResponse } from '@caho/contracts';
import type { ErrorSchema } from '@caho/schemas';
import { AxiosError } from 'axios';
import { parse } from 'cookie';
import { api } from '@/utils/api';

export const login = async (
  payload: SignInRequest
): Promise<SignInResponse | ErrorSchema> => {
  try {
    const { headers } = await api.post<SignInResponse>(
      '/auth/sign-in',
      payload
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
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data as ErrorSchema;
    }
  }

  redirect('/dashboard');
};
