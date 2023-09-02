import type {
  SignedInAuthObject,
  SignedOutAuthObject
} from '@clerk/nextjs/api';
import { getAuth } from '@clerk/nextjs/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
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

export const createTRPCContext = (opts: FetchCreateContextFnOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const auth = getAuth(opts.req);

  return createInnerTRPCContext({
    auth
  });
};
