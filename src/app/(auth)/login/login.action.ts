'use server';

import { AxiosError } from 'axios';
import { api } from '@/utils/api';
import { storeBackendSession } from '@/auth/session-cookie';
import {
  signInRequest,
  type SignInRequest,
  type SignInResponse
} from '@/contracts';

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

    await storeBackendSession(headers['set-cookie']);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.response?.data.message;
    }

    throw e;
  }
}
