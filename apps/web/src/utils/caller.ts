import { auth } from '@clerk/nextjs/app-beta';
import { redis } from '@/server/redis';
import { appRouter } from '@/server/routers/_app';

export const createCaller = () =>
  appRouter.createCaller({
    redis,
    auth: auth()
  });
