import { getRoom } from '@/services/room';
import { type App } from '..';

export const roomRouter = (app: App) =>
  app.group('/rooms', app =>
    app.get(
      '/:roomCode',
      async ({ params: { roomCode }, store: { redis } }) => {
        const room = await getRoom({
          redis,
          roomCode
        });

        return room;
      }
    )
  );
