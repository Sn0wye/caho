import type { PropsWithChildren } from 'react';
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { User } from '@caho/schemas';
import { api } from '@/utils/api';
import 'server-only';
import { AuthClientProvider } from './client';

export async function AuthServerProvider({ children }: PropsWithChildren) {
  const user = await getUser();
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session')?.value || null;

  return (
    <AuthClientProvider user={user} sessionCookie={sessionCookie}>
      {children}
    </AuthClientProvider>
  );
}

export const getUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');

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
