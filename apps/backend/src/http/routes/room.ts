import type { App } from '@/app';
import { createRoomController } from '../controllers/room/create-room';
import { endRoomController } from '../controllers/room/end-room';
import { getRoomController } from '../controllers/room/get-room';
import { getRoomPlayersController } from '../controllers/room/get-room-players';
import { joinRoomController } from '../controllers/room/join-room';
import { leaveRoomController } from '../controllers/room/leave-room';
import { listPublicController } from '../controllers/room/list-public-rooms';
import { playerReadyController } from '../controllers/room/player-ready';
import { startRoomController } from '../controllers/room/start-room';
import { getRoomBlackCardController } from '../controllers/room/get-room-black-card';
import { getCurrentWhiteCardsController } from '../controllers/room/get-current-white-cards';

export const roomRoutes = async (app: App) => {
  app.register(listPublicController);
  app.register(getRoomController);
  app.register(getRoomPlayersController);
  app.register(getRoomBlackCardController);
  app.register(createRoomController);
  app.register(joinRoomController);
  app.register(leaveRoomController);
  app.register(startRoomController);
  app.register(endRoomController);
  app.register(playerReadyController);
  app.register(getCurrentWhiteCardsController);
};
