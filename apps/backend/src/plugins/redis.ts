import { playerSchema, type Player } from '@caho/schemas';
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

export async function updatePlayerState({
  redis,
  roomCode,
  playerData
}: {
  redis: Redis;
  roomCode: string;
  playerData: Partial<Player>;
}): Promise<Player | null> {
  const playerKey = `room:${roomCode}:player:${playerData.id}`;

  const currentData = await redis.get(playerKey);
  if (!currentData) return null;

  const currentPlayer = playerSchema.parse(JSON.parse(currentData));

  const updatedPlayer = {
    ...currentPlayer,
    ...playerData
  };

  const validatedPlayer = playerSchema.safeParse(updatedPlayer);
  if (!validatedPlayer.success) {
    throw new Error('Invalid player data');
  }

  await redis.set(playerKey, JSON.stringify(validatedPlayer.data));

  return validatedPlayer.data;
}
