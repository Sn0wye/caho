import { type App } from '@/app';
import { createRoomController } from '../controllers/room/create-room';
import { endRoomController } from '../controllers/room/end-room';
import { getRoomController } from '../controllers/room/get-room';
import { getRoomPlayersController } from '../controllers/room/get-room-players';
import { joinRoomController } from '../controllers/room/join-room';
import { leaveRoomController } from '../controllers/room/leave-room';
import { listPublicController } from '../controllers/room/list-public-rooms';
import { startRoomController } from '../controllers/room/start-room';

export const roomRoutes = async (app: App) => {
  app.register(listPublicController);
  app.register(getRoomController);
  app.register(getRoomPlayersController);
  app.register(createRoomController);
  app.register(joinRoomController);
  app.register(leaveRoomController);
  app.register(startRoomController);
  app.register(endRoomController);
};
