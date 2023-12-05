import { type PropsWithChildren } from 'react';
import { getUser } from '.';
import { AuthClientProvider } from './client';

export async function AuthServerProvider({ children }: PropsWithChildren) {
  const user = await getUser();

  return <AuthClientProvider user={user}>{children}</AuthClientProvider>;
}
