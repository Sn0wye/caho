import { z } from 'zod';
import { type Player } from '../schemas/player';
import { createRoomSchema, leaveRoomSchema } from '../schemas/room';
import {
  createRoom,
  endRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  listPublicRooms,
  startRoom
} from '../services/room';
import { protectedProcedure, router } from '../trpc';

export const roomRouter = router({
  get: protectedProcedure
    .input(z.object({ roomCode: z.string().min(1) }))
    .query(({ ctx, input }) => {
      const { roomCode } = input;
      return getRoom({ redis: ctx.redis, roomCode });
    }),
  list: protectedProcedure.query(({ ctx }) =>
    listPublicRooms({ redis: ctx.redis })
  ),
  new: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ ctx, input }) => {
      const room = await createRoom({ redis: ctx.redis, room: input });

      return {
        redirect: `/room/${room.code}`,
        room
      };
    }),
  join: protectedProcedure
    .input(
      z.object({
        roomCode: z.string().min(1),
        password: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomCode } = input;

      const player: Player = {
        id: ctx.auth.userId,
        avatarUrl: ctx.auth.user?.imageUrl,
        username: ctx.auth.user?.username || 'Anônimo',
        isHost: false,
        score: 0
      };

      await joinRoom({
        redis: ctx.redis,
        input: {
          roomCode,
          player
        }
      });

      // Retornar os detalhes da sala atualizados
      return getRoom({ redis: ctx.redis, roomCode });
    }),
  start: protectedProcedure
    .input(z.object({ roomCode: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await startRoom({
        redis: ctx.redis,
        input: {
          roomCode: input.roomCode,
          playerId: ctx.auth.userId
        }
      });
    }),
  end: protectedProcedure
    .input(
      z.object({
        roomCode: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomCode } = input;

      await endRoom({
        redis: ctx.redis,
        roomCode
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
