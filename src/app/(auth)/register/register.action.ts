'use server';

import { authenticate, type AuthResult } from '@/auth/authenticate';
import { signUpRequest, type SignUpRequest } from '@/contracts';

export async function registerAction(
  fields: SignUpRequest
): Promise<AuthResult> {
  const validatedFields = signUpRequest.safeParse(fields);

  if (!validatedFields.success) {
    return { ok: false, message: 'Usuário ou senha inválidos' };
  }

  return authenticate('/auth/sign-up', validatedFields.data);
}
