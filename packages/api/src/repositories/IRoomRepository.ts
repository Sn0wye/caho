import { type Player } from '@/schemas/player';
import {
  type CreateRoomSchema,
  type JoinRoomSchema,
  type LeaveRoomSchema,
  type Room,
  type StartRoomSchema
} from '@/schemas/room';

export interface IRoomRepository {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoomSchema): Promise<Room>;
  listPublicRooms(): Promise<Room[]>;
  addPlayerToRoom(args: { roomCode: string; player: Player }): Promise<void>;
  startRoom(input: StartRoomSchema): Promise<void>;
  endRoom(roomCode: string): Promise<
    {
      score: number;
      player: Player;
    }[]
  >;
  joinRoom(input: JoinRoomSchema): Promise<void>;
  leaveRoom(input: LeaveRoomSchema): Promise<void>;
}
