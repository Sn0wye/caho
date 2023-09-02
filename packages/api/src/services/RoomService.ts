import { type IRoomRepository } from '@/repositories/IRoomRepository';
import { type Player } from '@/schemas/player';
import {
  type CreateRoomSchema,
  type JoinRoomSchema,
  type LeaveRoomSchema,
  type Room,
  type StartRoomSchema
} from '@/schemas/room';
import { type IRoomService } from './IRoomService';

export class RoomService implements IRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async getRoom(roomCode: string): Promise<Room> {
    return await this.roomRepository.getRoom(roomCode);
  }

  public async createRoom(room: CreateRoomSchema): Promise<Room> {
    return await this.roomRepository.createRoom(room);
  }

  public async listPublicRooms(): Promise<Room[]> {
    return await this.roomRepository.listPublicRooms();
  }

  public async addPlayerToRoom(args: {
    roomCode: string;
    player: Player;
  }): Promise<void> {
    return await this.roomRepository.addPlayerToRoom(args);
  }

  public async startRoom(input: StartRoomSchema): Promise<void> {
    return await this.roomRepository.startRoom(input);
  }

  public async endRoom(roomCode: string): Promise<
    {
      score: number;
      player: Player;
    }[]
  > {
    return await this.roomRepository.endRoom(roomCode);
  }

  public async joinRoom(input: JoinRoomSchema): Promise<void> {
    return await this.roomRepository.joinRoom(input);
  }

  public async leaveRoom(input: LeaveRoomSchema): Promise<void> {
    return await this.roomRepository.leaveRoom(input);
  }
}
