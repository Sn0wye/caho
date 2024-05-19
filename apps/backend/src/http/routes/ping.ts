import { z } from 'zod';
import type { App } from '@/app';

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
