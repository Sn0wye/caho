import type { Player } from '@caho/schemas';

export interface IRoomPlayersRepository {
  getRoomPlayersByCode(roomCode: string): Promise<Player[]>;
  addPlayerToRoom(input: { roomCode: string; player: Player }): Promise<void>;
  getPlayerFromRoom(
    roomCode: string,
    playerId: string
  ): Promise<Player | undefined>;
  updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<void>;
  incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void>;
  deletePlayerFromRoom: (roomCode: string, playerId: string) => Promise<void>;
}
