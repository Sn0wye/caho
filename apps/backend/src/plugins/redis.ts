import { RedisRoomRepository } from '@/repositories/room/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';
import type { Player } from '@caho/schemas';
import type { Redis } from 'ioredis';
import type { User } from 'lucia';

export async function getOrCreatePlayer({
  roomCode,
  user,
  redis
}: {
  roomCode: string;
  user: User;
  redis: Redis;
}): Promise<Player> {
  const roomService = new RoomService(new RedisRoomRepository(redis));

  try {
    return await roomService.getPlayerFromRoom(roomCode, user.id);
  } catch {
    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      isHost: false,
      isReady: false,
      isJudge: false,
      score: 0,
      cards: []
    };
  }
}
