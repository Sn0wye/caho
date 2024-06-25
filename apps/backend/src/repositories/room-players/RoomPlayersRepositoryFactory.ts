import type { IRoomPlayersRepository } from './IRoomPlayersRepository';
import { RoomPlayersRepository } from './RoomPlayersRepository';

export function RoomPlayersRepositoryFactory(): IRoomPlayersRepository {
  return new RoomPlayersRepository();
}
