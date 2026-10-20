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

// Seats sit just past the rim; each Hand lies on the felt just inside it, and
// played cards between Hand and centre.
const SEAT_DISTANCE = 1.2;
const HAND_DISTANCE = 0.8;
const PLAYED_CARD_DISTANCE = 0.6;

// A face-down card in a Hand on the felt, and how far apart the overlapping
// cards sit, in table units (multiply by the radius for px).
export const HAND_CARD_WIDTH = 0.085;
export const HAND_CARD_HEIGHT = 0.125;
export const HAND_CARD_STEP = 0.052;

export type TableSeat = {
  player: RoomPlayer;
  color: string;
  position: CursorPosition;
  cardPosition: CursorPosition;
  // Centre of the Player's face-down Hand on the felt.
  handPosition: CursorPosition;
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
    handPosition: seatPosition(index, count, HAND_DISTANCE),
    facingDeg: -spinForSeat(index, count)
  }));
  const selfIndex = ordered.findIndex(player => player.id === selfId);
  return { seats, spinDeg: selfIndex < 0 ? 0 : spinForSeat(selfIndex, count) };
}

/**
 * Where card `slot` of a `size`-card Hand lies on the felt, in table space: the
 * Hand runs left to right as its owner sees it, centred on `handPosition`.
 *
 * @example
 * handSlotPosition(seat, 0, 10); // the owner's leftmost card
 */
export function handSlotPosition(
  seat: TableSeat,
  slot: number,
  size: number
): CursorPosition {
  // facingDeg is the seat's angle, so the Hand's left-to-right runs along it.
  const angle = (seat.facingDeg * Math.PI) / 180;
  const offset = (slot - (size - 1) / 2) * HAND_CARD_STEP;
  return {
    x: seat.handPosition.x + Math.cos(angle) * offset,
    y: seat.handPosition.y + Math.sin(angle) * offset
  };
}
