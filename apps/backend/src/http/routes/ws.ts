import type { App } from '@/app';
import { z } from 'zod';

export const wsRoutes = async (app: App) => {
  app.get(
    '/room/:roomCode',
    {
      websocket: true,
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    (conn, req) => {
      app.pubsub.subscribe(req.params.roomCode, message => {
        console.log('message', message);
        conn.socket.send(JSON.stringify(message));
      });
    }
  );

  app.get(
    '/:userId',
    {
      websocket: true,
      schema: {
        params: z.object({
          userId: z.string()
        })
      }
    },
    (conn, req) => {
      app.pubsub.subscribe(req.params.userId, message => {
        conn.socket.send(JSON.stringify(message));
      });
    }
  );
};
