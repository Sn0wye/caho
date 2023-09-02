import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { env } from '@/env.mjs';
import { createTRPCContext } from '@/server/context';
import { appRouter } from '@/server/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : undefined
  });

export { handler as GET, handler as POST };
