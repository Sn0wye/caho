'use server';

import { cookies } from 'next/headers';
import { api } from '@/utils/api';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const sessionCookie = cookies().get('auth_session');

  if (!sessionCookie) {
    return;
  }

  await api.post('/auth/sign-out', {
    headers: {
      cookie: `auth_session=${sessionCookie.value}`
    }
  });

  redirect('/');
  return;
};
