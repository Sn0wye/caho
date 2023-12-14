import { type Player } from '@caho/schemas';
import { wsClientEventSchema } from '@caho/schemas/ws';
import { type SocketStream } from '@fastify/websocket';
import { type FastifyRequest } from 'fastify';
import { getSocketSession } from '@/auth/lucia';
import { redis } from '@/db/redis';
import { type HTTPError } from '@/errors/HTTPError';
import { RedisRoomRepository } from '@/repositories/implementations/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';
import { RoomSocketManager } from '@/services/RoomSocketManager';

const rooms = new RoomSocketManager();

export async function RoomWebsocketController(
  conn: SocketStream,
  req: FastifyRequest
) {
  const session = await getSocketSession(req);
  const { roomCode } = req.params as {
    roomCode?: string;
  };
  const { socket } = conn;

  if (!session || !roomCode) {
    return socket.close();
  }

  const roomService = new RoomService(new RedisRoomRepository(redis));

  const { userId } = session.user;

  rooms.addSocket(roomCode, userId, socket);

  socket.on('close', () => {
    rooms.removeSocket(roomCode, userId);
  });

  socket.on('message', async message => {
    const parsedMessage = wsClientEventSchema.safeParse(
      JSON.parse(message.toString())
    );

    if (!parsedMessage.success) {
      console.error('parsing error', parsedMessage.error);
      return socket.send('Invalid message');
    }

    const { data } = parsedMessage;

    switch (data.type) {
      case 'join-room': {
        try {
          const player = {
            id: userId,
            isHost: false,
            score: 0,
            username: session.user.username,
            avatarUrl: session.user.avatarUrl,
            isReady: false
          } satisfies Player;

          await roomService.joinRoom({
            player,
            roomCode,
            password: data.payload.password
          });

          await rooms.broadcast(roomCode, {
            type: 'player-joined',
            payload: player
          });
        } catch (e) {
          console.log((e as HTTPError).message);
        }
        break;
      }
      case 'ready': {
        const { ready } = data.payload;
        await roomService.setPlayerReady(roomCode, userId, ready);
        const player = await roomService.getPlayerFromRoom(roomCode, userId);

        await rooms.broadcast(roomCode, {
          type: 'player-ready',
          payload: player
        });

        break;
      }
    }
  });
}
