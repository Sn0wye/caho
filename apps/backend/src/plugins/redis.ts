import { type Player } from '@caho/schemas';
import { type Redis } from 'ioredis';
import { type Session } from 'lucia';
import { RedisRoomRepository } from '@/repositories/room/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';

export async function getOrCreatePlayer({
  roomCode,
  session,
  redis
}: {
  roomCode: string;
  session: Session;
  redis: Redis;
}): Promise<Player> {
  const roomService = new RoomService(new RedisRoomRepository(redis));

  try {
    return await roomService.getPlayerFromRoom(roomCode, session.user.id);
  } catch {
    return {
      id: session.user.id,
      username: session.user.username,
      avatarUrl: session.user.avatarUrl,
      isHost: false,
      isReady: false,
      score: 0
    };
  }
}
