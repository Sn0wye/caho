import { cookies } from 'next/headers';
import axios from 'axios';
import { env } from '@/env.mjs';
import 'server-only';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
});

// Server-side requests have no browser cookie jar, so forward the session as a
// Bearer token (the backend accepts either).
api.interceptors.request.use(async config => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session')?.value;

  if (sessionCookie) {
    config.headers.Authorization = `Bearer ${sessionCookie}`;
  }

  return config;
});
