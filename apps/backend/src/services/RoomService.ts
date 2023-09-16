import { type EndRoom, type StartRoom } from '@caho/contracts';
import { type Player, type Room } from '@caho/schemas';
import { type IRoomRepository } from '@/repositories/IRoomRepository';
import { type CreateRoomInput } from '@/schemas/create-room';
import { type JoinRoomInput } from '@/schemas/join-room';
import { type LeaveRoomInput } from '@/schemas/leave-room';
import { type IRoomService } from './IRoomService';

export class RoomService implements IRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async getRoom(roomCode: string): Promise<Room> {
    return await this.roomRepository.getRoom(roomCode);
  }

  public async createRoom(room: CreateRoomInput): Promise<Room> {
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

  public async startRoom(input: StartRoom): Promise<void> {
    return await this.roomRepository.startRoom(input);
  }

  public async endRoom(input: EndRoom): Promise<
    {
      score: number;
      player: Player;
    }[]
  > {
    return await this.roomRepository.endRoom(input);
  }

  public async joinRoom(input: JoinRoomInput): Promise<void> {
    return await this.roomRepository.joinRoom(input);
  }

  public async leaveRoom(input: LeaveRoomInput): Promise<void> {
    return await this.roomRepository.leaveRoom(input);
  }
}
