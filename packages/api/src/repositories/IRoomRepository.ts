import {
  type CreateRoom,
  type JoinRoom,
  type LeaveRoom,
  type StartRoom
} from '@caho/contracts';
import { type Player, type Room } from '@caho/schemas';

export interface IRoomRepository {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoom): Promise<Room>;
  listPublicRooms(): Promise<Room[]>;
  addPlayerToRoom(args: { roomCode: string; player: Player }): Promise<void>;
  startRoom(input: StartRoom): Promise<void>;
  // TODO: ranking schema
  endRoom(roomCode: string): Promise<
    {
      score: number;
      player: Player;
    }[]
  >;
  joinRoom(input: JoinRoom): Promise<void>;
  leaveRoom(input: LeaveRoom): Promise<void>;
}
