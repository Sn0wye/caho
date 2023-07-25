import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { type Player } from '../schemas/player';
import { createRoomSchema, joinRoomSchema, roomSchema } from '../schemas/room';
import {
  addPlayerToRoom,
  createRoom,
  getRoom,
  listRooms,
  startRoom
} from '../services/room';
import { protectedProcedure, router } from '../trpc';

export const roomRouter = router({
  get: protectedProcedure
    .input(z.object({ roomId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      const { roomId } = input;
      return getRoom({ redis: ctx.redis, roomId });
    }),
  list: protectedProcedure.query(({ ctx }) => listRooms({ redis: ctx.redis })),
  new: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ ctx, input }) => {
      const game = await createRoom({ redis: ctx.redis, room: input });

      return {
        redirect: `/game/${game.id}`,
        game
      };
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
      const room = roomSchema.parse(
        await getRoom({ redis: ctx.redis, roomId })
      );

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
    }),
  start: protectedProcedure
    .input(z.object({ roomId: z.string().min(1), playerId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await startRoom({
        redis: ctx.redis,
        input
      });
    })
});
