import { RankingRepositoryFactory } from '@/repositories/ranking';
import { RoomRepositoryFactory } from '@/repositories/room';
import { RoomPlayersRepositoryFactory } from '@/repositories/room-players';
import type { IRoomService } from './IRoomService';
import { RoomService } from './RoomService';

export function RoomServiceFactory(): IRoomService {
  return new RoomService(
    RoomRepositoryFactory(),
    RankingRepositoryFactory(),
    RoomPlayersRepositoryFactory()
  );
}
