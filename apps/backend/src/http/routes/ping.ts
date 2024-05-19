import type { App } from '@/app';
import { z } from 'zod';

export const pingRoute = async (app: App) => {
  app.get(
    '/ping',
    {
      schema: {
        response: {
          200: z.string()
        }
      }
    },
    () => 'pong'
  );
};
