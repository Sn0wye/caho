import type {
  SignedInAuthObject,
  SignedOutAuthObject
} from '@clerk/nextjs/api';
import { getAuth } from '@clerk/nextjs/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { redis } from './redis';

interface CreateContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    redis
  };
};

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);

  return createInnerTRPCContext({
    auth
  });
};
