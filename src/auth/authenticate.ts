import { api } from '@/utils/server/api';
import { getApiErrorMessage } from '@/utils/game-api';
import type { SignInResponse, SignUpRequest } from '@/contracts';
import 'server-only';
import { storeBackendSession } from './session-cookie';

export type AuthResult =
  | { ok: true; user: SignInResponse }
  | { ok: false; message: string };

// Server actions must return their failures: anything they throw reaches the
// client as Next's redacted "error occurred in the Server Components render"
// message in production.
export async function authenticate(
  path: '/auth/sign-in' | '/auth/sign-up',
  credentials: SignUpRequest
): Promise<AuthResult> {
  try {
    const { data, headers } = await api.post<SignInResponse>(
      path,
      credentials
    );

    await storeBackendSession(headers['set-cookie']);

    return { ok: true, user: data };
  } catch (error) {
    console.error(`${path} failed:`, error);

    return { ok: false, message: getApiErrorMessage(error) };
  }
}
