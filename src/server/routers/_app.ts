import { publicProcedure, router } from '../trpc';

export const appRouter = router({
  example: publicProcedure.query(() => 'Hello world!')
});

// export type definition of API
export type AppRouter = typeof appRouter;
