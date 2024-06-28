import { db } from '@/db';
import { roomPlayers, rooms, users } from '@/db/schema';
import type { PublicRoomWithPlayerCountAndHost, Room } from '@caho/schemas';
import { and, count, eq } from 'drizzle-orm';
import type { IRoomRepository } from './IRoomRepository';

export class RoomRepository implements IRoomRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async getRoomByCode(roomCode: string): Promise<Room | undefined> {
    const room = await this.db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.code, roomCode)
    });

    return room;
  }

  async create(data: Room): Promise<Room> {
    const room = (await this.db.insert(rooms).values(data).returning())[0];

    return room;
  }

  async listPublicRooms(): Promise<PublicRoomWithPlayerCountAndHost[]> {
    const publicRooms = await this.db
      .select({
        id: rooms.id,
        code: rooms.code,
        maxPlayers: rooms.maxPlayers,
        maxPoints: rooms.maxPoints,
        playerCount: count(roomPlayers.playerId).mapWith(Number),
        hostUsername: users.username
      })
      .from(rooms)
      .innerJoin(users, eq(rooms.hostId, users.id))
      .leftJoin(roomPlayers, eq(rooms.code, roomPlayers.roomCode))
      .where(and(eq(rooms.isPublic, true), eq(rooms.status, 'LOBBY')))
      .groupBy(rooms.id, rooms.code, rooms.maxPlayers, rooms.maxPoints)
      .execute();

    // TODO: auto expire rooms

    return publicRooms;
  }

  async update(roomCode: string, data: Partial<Room>): Promise<Room> {
    const room = (
      await this.db
        .update(rooms)
        .set(data)
        .where(eq(rooms.code, roomCode))
        .returning()
    )[0];

    return room;
  }
}
