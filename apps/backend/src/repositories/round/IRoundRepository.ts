import type { Round } from '@caho/schemas';

export interface IRoundRepository {
  create(input: Round): Promise<Round>;
  find(roomCode: string, number: number): Promise<Round | null>;
  update(id: string, data: Partial<Round>): Promise<Round | null>;
}
