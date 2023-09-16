import {
  type CreateRoom,
  type EndRoom,
  type JoinRoom,
  type LeaveRoom,
  type StartRoom
} from '@caho/contracts';
import { Ranking, type Player, type Room } from '@caho/schemas';

export interface IRoomService {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoom): Promise<Room>;
  listPublicRooms(): Promise<Room[]>;
  addPlayerToRoom(input: { roomCode: string; player: Player }): Promise<void>;
  startRoom(input: StartRoom): Promise<void>;
  endRoom(input: EndRoom): Promise<Ranking>;
  joinRoom(input: JoinRoom): Promise<void>;
  leaveRoom(input: LeaveRoom): Promise<void>;
}
