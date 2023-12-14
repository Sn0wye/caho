import { type Player, type Ranking, type Room } from '@caho/schemas';
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

  public async startRoom(roomCode: string): Promise<void> {
    return await this.roomRepository.startRoom(roomCode);
  }

  public async endRoom(roomCode: string): Promise<Ranking> {
    const ranking = await this.roomRepository.endRoom(roomCode);
    return ranking;
  }

  public async joinRoom(input: JoinRoomInput): Promise<void> {
    return await this.roomRepository.joinRoom(input);
  }

  public async leaveRoom(input: LeaveRoomInput): Promise<void> {
    return await this.roomRepository.leaveRoom(input);
  }

  public async getRoomPlayers(roomCode: string): Promise<Player[]> {
    return await this.roomRepository.getRoomPlayers(roomCode);
  }

  public async setPlayerReady(
    roomCode: string,
    playerId: string,
    ready: boolean
  ): Promise<void> {
    return await this.roomRepository.setPlayerReady(roomCode, playerId, ready);
  }

  public async getPlayerFromRoom(
    roomCode: string,
    playerId: string
  ): Promise<Player> {
    return await this.roomRepository.getPlayerFromRoom(roomCode, playerId);
  }
}
