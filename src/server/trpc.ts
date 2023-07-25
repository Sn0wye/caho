import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { type createTRPCContext } from './context';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (
    !ctx.auth.userId ||
    ctx.auth.user === null ||
    ctx.auth.user === undefined
  ) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      auth: {
        userId: ctx.auth.userId,
        user: ctx.auth.user
      }
    }
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
