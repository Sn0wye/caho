import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { type Player } from '../schemas/player';
import { createRoomSchema, joinRoomSchema, type Room } from '../schemas/room';
import {
  addPlayerToRoom,
  createRoom,
  getRoom,
  listRooms
} from '../services/game';
import { protectedProcedure, router } from '../trpc';

export const roomRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return getRoom({ redis: ctx.redis, roomId: input.id });
    }),
  list: protectedProcedure.query(({ ctx }) => listRooms({ redis: ctx.redis })),
  new: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ ctx, input }) => {
      const game = await createRoom({ redis: ctx.redis, room: input });
      return game;
    }),
  join: protectedProcedure
    .input(joinRoomSchema)
    .mutation(async ({ ctx, input }) => {
      const roomId = input.id;

      // Verificar se a sala existe
      const roomExists = await ctx.redis.exists(`room:${roomId}`);
      if (!roomExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'A sala não existe' // TODO
        });
      }

      // Obter os detalhes da sala
      const room = (await getRoom({ redis: ctx.redis, roomId })) as Room;

      // Verificar se a sala está cheia
      if (room.players.length >= room.maxPlayers) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A sala está cheia'
        });
      }

      // Verificar se a senha está correta
      if (room.password !== input.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Senha incorreta!'
        });
      }

      const newPlayer: Player = {
        id: input.id,
        points: 0,
        username: ctx.auth.user.username || 'Anônimo',
        avatarUrl: ctx.auth.user.imageUrl,
        isHost: false
      };

      // Adicionar o jogador à sala e atualizar o ranking
      await addPlayerToRoom({ redis: ctx.redis, roomId, player: newPlayer });

      // Retornar os detalhes da sala atualizados
      return getRoom({ redis: ctx.redis, roomId });
    })
});
