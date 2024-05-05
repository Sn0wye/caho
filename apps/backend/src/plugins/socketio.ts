import { type Player, type Room, type RoomState } from '@caho/schemas';
import { type Session, type User } from 'lucia';
import { Server, type ServerOptions } from 'socket.io';
import { type App } from '@/app';
import { basePack, type BlackCard, type WhiteCard } from '@/cards/base-pack';
import { HTTPError } from '@/errors/HTTPError';
import { CardService } from '@/services/CardService';
import { type IRoomService } from '@/services/IRoomService';
import { RoomService } from '@/services/RoomService';
import { getOrCreatePlayer } from './redis';

export const fastifySocketIO = async (
  app: App,
  opts: Partial<ServerOptions>
) => {
  app.decorate('io', new Server(app.server, opts));
  app.addHook('onClose', (fastify, done) => {
    fastify.io.close();
    done();
  });

  // auth middleware
  app.io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const { session, user } = await getSessionFromToken(token);

    if (!session || !user) {
      return next(new Error('Unauthorized'));
    }

    socket.data.session = session;
    socket.data.user = user;

    next();
  });

  app.io.on('connection', async socket => {
    const roomCode = socket.data.roomCode;

    socket.on('joinRoom', async (roomCode, password) => {
      const player = await getOrCreatePlayer({
        roomCode,
        user: socket.data.user,
        redis: app.redis
      });

      try {
        await roomService.joinRoom({
          roomCode,
          password,
          player
        });

        socket.join(roomCode);
        socket.join(player.id);
        socket.to(roomCode).emit('playerJoined', player);
        // TODO: remove this message
        socket.emit('message', `You have joined the room ${roomCode}.`);

        socket.data.roomCode = roomCode;
        socket.data.player = player;
      } catch (e) {
        console.log(e);
        if (e instanceof HTTPError) {
          socket.emit('error', e);
        }
      }
    });

    const roomService = new RoomService(new PostgresRoomRepository());
    const cardService = new CardService(basePack);

    socket.on('ping', () => {
      socket.emit('message', 'pong');
    });

    socket.on('message', msg => {
      socket.to(roomCode).emit('message', msg);
    });

    socket.on('isReady', async isReady => {
      const player = socket.data.player;

      await roomService.updatePlayerInRoom(roomCode, player.id, { isReady });
      socket.data.player.isReady = isReady;
      socket.to(roomCode).emit('playerReady', player.id, isReady);
    });

    socket.on('startRoom', async () => {
      console.log(socket.data.player);
      if (!socket.data.player) {
        return;
      }

      if (!socket.data.player.isHost) {
        console.error('You cannot start, as you are not the host');
        return;
      }

      try {
        await roomService.startRoom(roomCode);
        const room = await roomService.getRoom(roomCode);
        socket.to(roomCode).emit('roomUpdated', room);

        const roomState = await roomService.getRoomState(roomCode);
        await setNextJudge(roomCode, roomState, roomService);

        // give players new cards
        const players = await roomService.getRoomPlayers(room.code);

        for (const player of players) {
          const cards = cardService.getNewWhiteCards(6);
          socket.to(player.id).emit('newCards', cards);
          await roomService.updatePlayerInRoom(room.code, player.id, {
            cards
          });
        }
        const blackCard = cardService.getNewBlackCards(1)[0];
        socket.to(roomCode).emit('newBlackCard', blackCard);
      } catch (e) {
        if (e instanceof HTTPError) {
          socket.emit('error', e);
        }
      }
    });

    socket.on('playCards', cards => {
      // TODO
      return;
    });

    socket.on('leaveRoom', () => {
      const player = socket.data.player;
      socket.leave(roomCode);

      if (player) {
        socket.to(roomCode).emit('playerLeft', player.id);
      }
    });

    socket.on('disconnect', async () => {
      const player = socket.data.player;
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
  roomStateUpdated: (roomState: RoomState) => void;
  newCards: (cards: WhiteCard[]) => void;
  newBlackCard: (card: BlackCard) => void;
}

interface ClientToServerEvents {
  message: (data: string) => void;
  ping: () => void;
  joinRoom: (roomCode: string, password: string | null) => void;
  leaveRoom: () => void;
  isReady: (isReady: boolean) => void;
  startRoom: () => void;
  playCards: (cards: WhiteCard[]) => void;
}

interface InterServerEvents {}

interface SocketData {
  session: Session;
  user: User;
  roomCode: string;
  player: Player;
}

export type IO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

declare module 'fastify' {
  interface FastifyInstance {
    io: IO;
  }
}

export async function setNextJudge(
  roomCode: string,
  roomState: RoomState,
  roomService: IRoomService
) {
  const prevJudgeId = roomState.prevJudgeId;

  if (prevJudgeId) {
    await roomService.updatePlayerInRoom(roomCode, prevJudgeId, {
      isJudge: false
    });
  }

  const players = await roomService.getRoomPlayers(roomCode);
  const playersWithoutJudge = players.filter(
    player => player.id !== prevJudgeId
  );

  const randomIndex = Math.floor(Math.random() * playersWithoutJudge.length);
  const newJudge = playersWithoutJudge[randomIndex];

  await roomService.updatePlayerInRoom(roomCode, newJudge.id, {
    isJudge: true
  });
}
