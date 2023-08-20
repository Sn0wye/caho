import { TRPCError } from '@trpc/server';
import { type Redis } from '@upstash/redis/nodejs';
import { type PlayerSchema } from '../schemas/player';
import { rankingSchema } from '../schemas/ranking';

export const getPlayerRanking = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}) => {
  const ranking = await redis.zrange(`room:${roomCode}:ranking`, 0, -1);

  const parsedRanking = rankingSchema.safeParse(ranking);

  if (!parsedRanking.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: parsedRanking.error.message
    });
  }

  return parsedRanking.data.sort((a, b) => b.score - a.score);
};

export const addPlayerToRanking = async ({
  redis,
  roomCode,
  player
}: {
  redis: Redis;
  roomCode: string;
  player: PlayerSchema;
}) => {
  await Promise.all([
    redis.zadd(`room:${roomCode}:ranking`, {
      score: player.score,
      member: player
    }),
    redis.expire(`room:${roomCode}:ranking`, 60 * 60 * 24)
  ]);
};

export const removePlayerFromRanking = async ({
  redis,
  roomCode,
  playerId
}: {
  redis: Redis;
  roomCode: string;
  playerId: string;
}) => {
  return await redis.zrem(`room:${roomCode}:ranking`, playerId);
};
