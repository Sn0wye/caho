import 'server-only';
import type { PropsWithChildren } from 'react';
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { User } from '@caho/schemas';
import { api } from '@/utils/api';
import { AuthClientProvider } from './client';

export async function AuthServerProvider({ children }: PropsWithChildren) {
  const user = await getUser();
  const sessionCookie = cookies().get('auth_session')?.value || null;

  return (
    <AuthClientProvider user={user} sessionCookie={sessionCookie}>
      {children}
    </AuthClientProvider>
  );
}

export const getUser = cache(async (): Promise<User | null> => {
  const sessionCookie = cookies().get('auth_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const { data } = await api.get<User>('/auth/profile', {
      headers: {
        cookie: `auth_session=${sessionCookie.value}`
      }
    });

    return data;
  } catch {
    return null;
  }
});
