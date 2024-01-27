import { type Player, type Room } from '@caho/schemas';
import { Server, type ServerOptions } from 'socket.io';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';
import basePack, { type WhiteCard } from '@/cards/base-pack';
import { HTTPError } from '@/errors/HTTPError';
import { RedisRoomRepository } from '@/repositories/room';
import { CardService } from '@/services/CardService';
import { type IRoomService } from '@/services/IRoomService';
import { RoomService } from '@/services/RoomService';
import { getOrCreatePlayer } from './redis';

export const fastifySocketIO = async (
  app: App,
  opts: Partial<ServerOptions>
) => {
  app.decorate('io', new Server(app.server, opts));
  app.addHook('onClose', (fastify: App, done) => {
    fastify.io.close();
    done();
  });

  app.io.on('connection', async socket => {
    const roomCode = socket.handshake.query['roomCode']?.toString();

    if (!roomCode) {
      socket.emit('message', 'no room code provided');
      socket.disconnect();
      return;
    }

    const cookie = socket.request.headers['auth_session']?.toString();
    if (!cookie) {
      socket.emit('message', 'no cookie provided');
      socket.disconnect();
      return;
    }
    const session = await auth.validateSession(cookie);
    const roomService = new RoomService(new RedisRoomRepository(app.redis));
    const cardService = new CardService(basePack);

    const player = await getOrCreatePlayer({
      roomCode,
      session,
      redis: app.redis
    });

    socket.join(roomCode);
    socket.join(player.id);
    socket.to(roomCode).emit('playerJoined', player);

    socket.on('message', msg => {
      if (!roomCode) return;
      socket.to(roomCode).emit('message', msg);
    });

    socket.on('ping', () => {
      socket.emit('message', 'pong');
    });

    // socket.on('joinRoom', async code => {
    //   socket.join(code);

    //   player = await getOrCreatePlayer({
    //     roomCode,
    //     session,
    //     redis: app.redis
    //   });

    //   socket.to(code).emit('playerJoined', player);
    // });

    socket.on('leaveRoom', () => {
      if (!roomCode) return;
      socket.leave(roomCode);

      if (player) {
        socket.to(roomCode).emit('playerLeft', player.id);
      }
    });

    socket.on('startRoom', async () => {
      try {
        await roomService.startRoom(roomCode);
        const room = await roomService.getRoom(roomCode);
        socket.to(roomCode).emit('roomUpdated', room);
        setNextJudge(room, roomService);

        // give players new cards
        const players = await roomService.getRoomPlayers(room.code);

        for (const player of players) {
          const cards = cardService.getNewWhiteCards(6);
          socket.to(player.id).emit('newCards', cards);
          await roomService.updatePlayerInRoom(room.code, player.id, {
            cards
          });
        }
      } catch (e) {
        if (e instanceof HTTPError) {
          socket.emit('error', e);
        }
      }
    });

    // socket.on("")

    socket.on('isReady', isReady => {
      if (!roomCode || !player) return;
      player.isReady = isReady;

      socket.to(roomCode).emit('playerReady', player.id, isReady);
    });

    socket.on('disconnect', async () => {
      if (!roomCode) return;

      if (player) {
        socket.to(roomCode).emit('playerLeft', player.id);
      }
    });
  });
};

interface ServerToClientEvents {
  message: (data: string) => void;
  error: (error: HTTPError) => void;
  playerJoined: (data: Player) => void;
  playerLeft: (playerId: string) => void;
  playerReady: (playerId: string, isReady: boolean) => void;
  roomUpdated: (room: Room) => void;
  newCards: (cards: WhiteCard[]) => void;
}

interface ClientToServerEvents {
  message: (data: string) => void;
  ping: () => void;
  joinRoom: (roomCode: string) => void;
  leaveRoom: () => void;
  isReady: (isReady: boolean) => void;
  startRoom: () => void;
  // getCard: (count?: number) => WhiteCard;
}

export type IO = Server<ClientToServerEvents, ServerToClientEvents>;

declare module 'fastify' {
  interface FastifyInstance {
    io: IO;
  }
}

export async function setNextJudge(room: Room, roomService: IRoomService) {
  const prevJudgeId = room.state.prevJudgeId;

  if (prevJudgeId) {
    await roomService.updatePlayerInRoom(room.code, prevJudgeId, {
      isJudge: false
    });
  }

  const players = await roomService.getRoomPlayers(room.code);
  const playersWithoutJudge = players.filter(
    player => player.id !== prevJudgeId
  );

  const randomIndex = Math.floor(Math.random() * playersWithoutJudge.length);
  const newJudge = playersWithoutJudge[randomIndex];

  await roomService.updatePlayerInRoom(room.code, newJudge.id, {
    isJudge: true
  });
}
