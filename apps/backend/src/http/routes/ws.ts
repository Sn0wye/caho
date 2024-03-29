import { z } from 'zod';
import { type App } from '@/app';
import { pubsub } from '@/lib/pub-sub';

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
      pubsub.subscribe(req.params.roomCode, message => {
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
      pubsub.subscribe(req.params.userId, message => {
        conn.socket.send(JSON.stringify(message));
      });
    }
  );
};
