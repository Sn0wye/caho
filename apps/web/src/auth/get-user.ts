import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { type User } from '@caho/schemas';
import { api } from '@/utils/api';

export const getUser = cache(async (): Promise<User | null> => {
  const sessionCookie = cookies().get('auth_session');

  if (!sessionCookie) {
    return null;
  }

  const { data } = await api.get<User>('/auth/profile', {
    headers: {
      'cookie': `auth_session=${sessionCookie.value}`
    }
  });

  return data ?? null;
});
