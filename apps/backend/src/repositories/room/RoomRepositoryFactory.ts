import type { IRoomRepository } from './IRoomRepository';
import { RoomRepository } from './RoomRepository';

export function RoomRepositoryFactory(): IRoomRepository {
  return new RoomRepository();
}
