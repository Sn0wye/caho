import 'server-only';
import { cookies } from 'next/headers';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
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
