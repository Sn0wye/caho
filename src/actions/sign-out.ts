'use server';

import { redirect } from 'next/navigation';
import { api } from '@/utils/server/api';
import { clearSession } from '@/auth/session-cookie';

export async function signOutAction() {
  try {
    // The server api forwards the session as a Bearer token.
    await api.post('/auth/sign-out');
  } catch (error) {
    console.error('Sign out error:', error);
  }

  await clearSession();
  redirect('/');
}
