import { z } from 'zod';
import { type Player } from '../schemas/player';
import { createRoomSchema, leaveRoomSchema } from '../schemas/room';
import {
  createRoom,
  endRoom,
  getRoom,
  joinRoom,
  leaveRoom,
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
    .input(
      z.object({
        roomId: z.string().min(1),
        password: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomId } = input;

      const player: Player = {
        id: ctx.auth.userId,
        avatarUrl: ctx.auth.user.imageUrl,
        username: ctx.auth.user.username || 'Anônimo',
        isHost: false,
        points: 0
      };

      await joinRoom({
        redis: ctx.redis,
        input: {
          roomId,
          player
        }
      });

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
    }),
  end: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomId } = input;

      await endRoom({
        redis: ctx.redis,
        roomId
      });
    }),
  leave: protectedProcedure
    .input(leaveRoomSchema)
    .mutation(async ({ ctx, input }) => {
      await leaveRoom({
        redis: ctx.redis,
        input
      });
    })
});

// TODO: room id edge cases 'finished' | 'new'
