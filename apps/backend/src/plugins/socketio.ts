import { type Player } from '@caho/schemas';
import { Server, type ServerOptions } from 'socket.io';
import { type App } from '@/app';
import { auth } from '@/auth/lucia';
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
    let roomCode: string | null = null;

    if (!roomCode) {
      socket.emit('message', 'no room code provided');
    }

    const cookie = socket.request.headers['auth_session']?.toString();
    if (!cookie) {
      socket.disconnect();
      return;
    }

    const session = await auth.validateSession(cookie);
    let player: Player | null = null;

    socket.on('message', msg => {
      if (!roomCode) return;
      socket.to(roomCode).emit('message', msg);
    });

    socket.on('ping', () => {
      socket.emit('message', 'pong');
    });

    socket.on('joinRoom', async code => {
      roomCode = code;
      socket.join(code);

      player = await getOrCreatePlayer({
        roomCode,
        session,
        redis: app.redis
      });

      socket.to(code).emit('playerJoined', player);
    });

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
  playerJoined: (data: Player) => void;
  playerLeft: (playerId: string) => void;
  playerReady: (playerId: string, isReady: boolean) => void;
  // emitCard: (card: WhiteCard) => void;
}

interface ClientToServerEvents {
  message: (data: string) => void;
  ping: () => void;
  joinRoom: (roomCode: string) => void;
  isReady: (isReady: boolean) => void;
  // getCard: (count?: number) => WhiteCard;
}

// interface InterServerEvents {
// message: (data: string) => void;
// }

// interface SocketData {
// userId: string;
// }

export type IO = Server<
  ClientToServerEvents,
  ServerToClientEvents
  // InterServerEvents,
  // SocketData
>;

declare module 'fastify' {
  interface FastifyInstance {
    io: IO;
  }
}

// utils
