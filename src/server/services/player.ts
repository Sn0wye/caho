import { TRPCError } from '@trpc/server';
import { type Redis } from '@upstash/redis/nodejs';
import {
  playersSchema,
  type PlayerSchema,
  type PlayersSchema
} from '../schemas/player';

export const getPlayersFromRoom = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}): Promise<PlayersSchema> => {
  const players = await redis.smembers(`room:${roomCode}:players`);

  const parsedPlayers = playersSchema.safeParse(players);

  if (!parsedPlayers.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: parsedPlayers.error.message
    });
  }

  return parsedPlayers.data;
};

export const isPlayerInRoom = async ({
  redis,
  roomCode,
  playerId
}: {
  redis: Redis;
  roomCode: string;
  playerId: string;
}) => {
  const players = await getPlayersFromRoom({ redis, roomCode });

  return players.some(player => player.id === playerId);
};

export const addPlayerToRoom = async ({
  redis,
  roomCode,
  player
}: {
  redis: Redis;
  roomCode: string;
  player: PlayerSchema;
}) => {
  await Promise.all([
    redis.rpush(`room:${roomCode}:players`, player),

    redis.expire(`room:${roomCode}:players`, 60 * 60 * 24)
  ]);
};

export const removePlayerFromRoom = async ({
  redis,
  roomCode,
  playerId
}: {
  redis: Redis;
  roomCode: string;
  playerId: string;
}) => {
  return await redis.lrem(`room:${roomCode}:players`, 0, playerId);
};
