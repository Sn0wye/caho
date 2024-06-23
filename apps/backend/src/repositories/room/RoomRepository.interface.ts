import type { CreateRoomInput } from '@/schemas/create-room';
import type { JoinRoomInput } from '@/schemas/join-room';
import type { LeaveRoomInput } from '@/schemas/leave-room';
import type {
  Player,
  PublicRoomWithPlayerCountAndHost,
  Ranking,
  Room
} from '@caho/schemas';

export interface IRoomRepository {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoomInput): Promise<Room>;
  listPublicRooms(): Promise<PublicRoomWithPlayerCountAndHost[]>;
  startRoom(roomCode: string): Promise<void>;
  endRoom(roomCode: string): Promise<Ranking>;
  joinRoom(input: JoinRoomInput): Promise<void>;
  leaveRoom(input: LeaveRoomInput): Promise<void>;
  getRoomPlayers(roomCode: string): Promise<Player[]>;
  addPlayerToRoom(input: { roomCode: string; player: Player }): Promise<void>;
  getPlayerFromRoom(roomCode: string, playerId: string): Promise<Player>;
  updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<void>;
  incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void>;
  updateRoom(roomCode: string, data: Partial<Room>): Promise<Room>;
}
