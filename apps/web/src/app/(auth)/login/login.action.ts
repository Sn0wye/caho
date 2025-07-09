'use server';

import { cookies } from 'next/headers';
import {
  SignInRequest,
  signInRequest,
  type SignInResponse
} from '@caho/contracts';
import { AxiosError } from 'axios';
import { parse } from 'cookie';
import { api } from '@/utils/api';

export async function loginAction(
  fields: SignInRequest
): Promise<SignInResponse> {
  const validatedFields = signInRequest.safeParse(fields);

  if (!validatedFields.success) {
    throw new Error('Error in Login Action');
  }

  try {
    const { data, headers } = await api.post<SignInResponse>(
      '/auth/sign-in',
      validatedFields.data
    );

    if (headers['set-cookie']) {
      const cookieStore = await cookies();
      const cookie = parse(headers['set-cookie'][0]) as {
        auth_session: string;
        Expires: string;
      };

      cookieStore.set({
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
}
