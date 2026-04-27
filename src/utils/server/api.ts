import { cookies } from 'next/headers';
import axios from 'axios';
import { env } from '@/env.mjs';
import 'server-only';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
});

api.interceptors.request.use(config => {
  if (isServer) {
    const sessionCookie = cookies().get('auth_session')?.value ?? '';

    console.log({ sessionCookie });

    config.headers.Authorization = `Bearer ${sessionCookie}`;
  }

  return config;
});

const isServer = typeof window === 'undefined';
