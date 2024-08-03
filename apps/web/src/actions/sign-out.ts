'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createServerAction } from 'zsa';
import { api } from '@/utils/server/api';

export const signOutAction = createServerAction()
  .input(z.null())
  .onSuccess(() => {
    redirect('/');
  })
  .handler(async () => {
    const sessionCookie = cookies().get('auth_session');

    if (!sessionCookie) {
      return;
    }

    await api.post('/auth/sign-out', {
      headers: {
        cookie: `auth_session=${sessionCookie.value}`
      }
    });

    return;
  });
