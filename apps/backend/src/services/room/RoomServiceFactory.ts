import { RankingRepositoryFactory } from '@/repositories/ranking';
import { RoomRepositoryFactory } from '@/repositories/room';
import { RoomPlayersRepositoryFactory } from '@/repositories/room-players';
import { RoomService } from './RoomService';
import type { IRoomService } from './IRoomService';

export function RoomServiceFactory(): IRoomService {
  return new RoomService(
    RoomRepositoryFactory(),
    RankingRepositoryFactory(),
    RoomPlayersRepositoryFactory()
  );
}
