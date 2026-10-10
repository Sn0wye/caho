'use server';

import { AxiosError } from 'axios';
import { createServerAction } from 'zsa';
import { api } from '@/utils/api';
import { storeBackendSession } from '@/auth/session-cookie';
import { signUpRequest, type SignUpResponse } from '@/contracts';

export const registerAction = createServerAction()
  .input(signUpRequest)
  .handler(async ({ input }) => {
    try {
      const { data, headers } = await api.post<SignUpResponse>(
        '/auth/sign-up',
        input
      );

      await storeBackendSession(headers['set-cookie']);

      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw e.response?.data.message;
      }

      throw e;
    }
  });
