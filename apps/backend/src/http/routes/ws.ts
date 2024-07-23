import type { App } from '@/app';
import { z } from 'zod';

export const wsRoutes = async (app: App) => {
  app.get(
    '/room/:roomCode',
    {
      websocket: true,
      schema: {
        tags: ['Rooms (Websocket)'],
        description: 'Listen for room events',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    (conn, req) => {
      conn.socket.on('ping', () => {
        conn.socket.pong();
      });

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
        tags: ['Rooms (Websocket)'],
        description: 'Listen for user events',
        params: z.object({
          userId: z.string()
        })
      }
    },
    (conn, req) => {
      conn.socket.on('ping', () => {
        conn.socket.pong();
      });

      app.pubsub.subscribe(req.params.userId, message => {
        conn.socket.send(JSON.stringify(message));
      });
    }
  );
};
