'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/utils/server/api';

export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (sessionCookie) {
      await api.post('/auth/sign-out', {
        headers: {
          cookie: `auth_session=${sessionCookie.value}`
        }
      });
    }
  } catch (error) {
    console.error('Sign out error:', error);
  }

  redirect('/');
}
