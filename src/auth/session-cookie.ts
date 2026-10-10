import { cookies, headers } from 'next/headers';
import { parse } from 'cookie';
import { env } from '@/env.mjs';
import 'server-only';

export const SESSION_COOKIE_NAME = 'auth_session';

// The browser talks to the backend directly (REST and WebSockets), so the
// session cookie must reach it too. When the backend lives on a subdomain of
// the frontend (caho.com.br → api.caho.com.br), scope the cookie to the parent
// domain; otherwise (e.g. localhost on another port) a host-only cookie is
// already shared.
export async function getSessionCookieDomain(): Promise<string | undefined> {
  const host = (await headers()).get('host')?.split(':')[0];
  const backendHost = new URL(env.NEXT_PUBLIC_BACKEND_URL).hostname;

  if (!host || host === backendHost) {
    return undefined;
  }

  const appDomain = host.replace(/^www\./, '');

  return backendHost.endsWith(`.${appDomain}`) ? appDomain : undefined;
}

// Copies the session the backend issued (server-to-server, so the browser never
// saw its Set-Cookie) onto the frontend's response.
export async function storeBackendSession(setCookie: string[] | undefined) {
  const header = setCookie?.find(value =>
    value.startsWith(`${SESSION_COOKIE_NAME}=`)
  );

  if (!header) return;

  const cookie = parse(header) as Record<string, string | undefined>;
  const value = cookie[SESSION_COOKIE_NAME];

  if (!value) return;

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value,
    expires: sessionExpiry(cookie),
    domain: await getSessionCookieDomain(),
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    domain: await getSessionCookieDomain(),
    path: '/'
  });
}

// Sign-in sends `Max-Age`; sign-up sends no attributes at all, which keeps the
// cookie for the browser session (undefined) instead of expiring it instantly.
function sessionExpiry(
  cookie: Record<string, string | undefined>
): Date | undefined {
  if (cookie.Expires) return new Date(cookie.Expires);
  if (cookie['Max-Age']) {
    return new Date(Date.now() + Number(cookie['Max-Age']) * 1000);
  }
  return undefined;
}
