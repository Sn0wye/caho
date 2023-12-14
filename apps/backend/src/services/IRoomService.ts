import { type Player, type Ranking, type Room } from '@caho/schemas';
import { type CreateRoomInput } from '@/schemas/create-room';
import { type JoinRoomInput } from '@/schemas/join-room';
import { type LeaveRoomInput } from '@/schemas/leave-room';

export interface IRoomService {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoomInput): Promise<Room>;
  listPublicRooms(): Promise<Room[]>;
  addPlayerToRoom(input: { roomCode: string; player: Player }): Promise<void>;
  startRoom(roomCode: string): Promise<void>;
  endRoom(roomCode: string): Promise<Ranking>;
  joinRoom(input: JoinRoomInput): Promise<void>;
  leaveRoom(input: LeaveRoomInput): Promise<void>;
  getRoomPlayers(roomCode: string): Promise<Player[]>;
  setPlayerReady(
    roomCode: string,
    playerId: string,
    ready: boolean
  ): Promise<void>;
  getPlayerFromRoom(roomCode: string, playerId: string): Promise<Player>;
}
