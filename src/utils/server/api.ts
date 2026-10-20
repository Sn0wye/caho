import { cookies, headers } from 'next/headers';
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

  const playerIp = await requestingPlayerIp();
  if (playerIp && env.BACKEND_PROXY_SECRET) {
    config.headers['x-caho-client-ip'] = playerIp;
    config.headers['x-caho-proxy-secret'] = env.BACKEND_PROXY_SECRET;
  }

  return config;
});

// These calls leave from Vercel's shared egress IPs, so the backend's per-IP
// rate limits would lump players together. Forward the player's own IP, which
// the backend trusts only alongside the shared secret. Vercel overwrites
// x-real-ip / x-forwarded-for with the real client, so players can't spoof it.
async function requestingPlayerIp(): Promise<string | null> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0];

  return requestHeaders.get('x-real-ip') ?? forwardedFor?.trim() ?? null;
}
