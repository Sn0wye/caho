import { db } from '@/db';
import type { IRoundRepository } from './IRoundRepository';
import type { Round } from '@caho/schemas';
import { rounds } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class RoundRepository implements IRoundRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  public async create(data: Round): Promise<Round> {
    const round = (await this.db.insert(rounds).values(data).returning())[0];
    return round;
  }

  public async find(roomCode: string, number: number): Promise<Round | null> {
    const round = await this.db.query.rounds.findFirst({
      where: (rounds, { and, eq }) =>
        and(eq(rounds.roomCode, roomCode), eq(rounds.roundNumber, number))
    });

    return round ?? null;
  }

  public async update(id: string, data: Partial<Round>): Promise<Round | null> {
    const round = await this.db
      .update(rounds)
      .set(data)
      .where(eq(rounds.id, id))
      .returning();

    return round[0] ?? null;
  }
}
