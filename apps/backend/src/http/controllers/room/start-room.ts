import { startRoom } from '@caho/contracts';
import { type App } from '@/app';
import { basePack } from '@/cards/base-pack';
import { ROOM_ERRORS } from '@/errors/room';
import { pubsub } from '@/lib/pub-sub';
import { RedisRoomRepository } from '@/repositories/room';
import { CardService } from '@/services/CardService';
import { RoomService } from '@/services/RoomService';

export const startRoomController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.post('/start', async (req, res) => {
    const { user } = req;

    if (!user) {
      return res.unauthorized();
    }

    try {
      const { roomCode } = startRoom.parse(req.body);
      const cardService = new CardService(app.redis, roomCode, basePack);
      const { hostId } = await roomService.getRoom(roomCode);

      if (user.id !== hostId) {
        return res.badRequest(ROOM_ERRORS.IS_NOT_ROOM_HOST);
      }

      await roomService.startRoom(roomCode);
      const room = await roomService.getRoom(roomCode);
      pubsub.publish(roomCode, {
        event: 'room-started',
        payload: room
      });

      const players = await roomService.getRoomPlayers(roomCode);
      for (const player of players) {
        const cards = await cardService.getNewWhiteCards(6);
        pubsub.publish(player.id, {
          event: 'cards-drawn',
          payload: cards
        });
      }

      res.status(204);
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
