'use server';

import { authenticate, type AuthResult } from '@/auth/authenticate';
import { signInRequest, type SignInRequest } from '@/contracts';

export async function loginAction(fields: SignInRequest): Promise<AuthResult> {
  const validatedFields = signInRequest.safeParse(fields);

  if (!validatedFields.success) {
    return { ok: false, message: 'Usuário ou senha inválidos' };
  }

  return authenticate('/auth/sign-in', validatedFields.data);
}
