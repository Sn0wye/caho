import { RoomRepository } from './RoomRepository';
import type { IRoomRepository } from './IRoomRepository';

export function RoomRepositoryFactory(): IRoomRepository {
  return new RoomRepository();
}
