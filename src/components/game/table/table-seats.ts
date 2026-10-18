import type { CursorPosition } from '@/contracts';
import type { RoomPlayer } from '@/schemas';
import { seatPosition, spinForSeat } from './table-geometry';

// Seat colours tie a cursor to its Player's seat.
const SEAT_COLORS = [
  '#e5c443',
  '#5c8bd6',
  '#ffa0f0',
  '#66ccbe',
  '#f1924c',
  '#c086ea',
  '#d1757e',
  '#8465cb'
];

// Seats sit just past the rim; played cards lie between seat and centre.
const SEAT_DISTANCE = 1.2;
const PLAYED_CARD_DISTANCE = 0.68;

export type TableSeat = {
  player: RoomPlayer;
  color: string;
  position: CursorPosition;
  cardPosition: CursorPosition;
  // Turns a card on the felt to face this seat.
  facingDeg: number;
};

/**
 * Seats every Player around the table, in the same order on every client
 * (by id, since the Players list grows in arrival order per client), and the
 * spin that puts `selfId` at the bottom.
 *
 * @example
 * const { seats, spinDeg } = arrangeSeats(players, userId);
 */
export function arrangeSeats(
  players: RoomPlayer[],
  selfId: string | null
): { seats: TableSeat[]; spinDeg: number } {
  const ordered = [...players].sort((a, b) => a.id.localeCompare(b.id));
  const count = ordered.length;
  const seats = ordered.map((player, index) => ({
    player,
    color: SEAT_COLORS[index % SEAT_COLORS.length],
    position: seatPosition(index, count, SEAT_DISTANCE),
    cardPosition: seatPosition(index, count, PLAYED_CARD_DISTANCE),
    facingDeg: -spinForSeat(index, count)
  }));
  const selfIndex = ordered.findIndex(player => player.id === selfId);
  return { seats, spinDeg: selfIndex < 0 ? 0 : spinForSeat(selfIndex, count) };
}
