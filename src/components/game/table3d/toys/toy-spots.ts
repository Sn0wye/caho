import type { CursorPosition } from '@/contracts';
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CARD_HEIGHT,
  deckSpot,
  HELD_HAND_DISTANCE,
  HELD_HAND_HEIGHT,
  trophySpot,
  type Seat3D
} from '../space';

export type ToyGroup = 'dice' | 'chips' | 'duck';

// Where a group of toys rests: a point near the rim, and the rim's tangent
// there (to line a pair up along it).
export type ToySpot = { point: CursorPosition; tangent: CursorPosition };

// Near the rim, clear of the judging grid in the centre.
const RING = 0.84;
const STEP = Math.PI / 90;

function angleOf(direction: CursorPosition): number {
  // Seats sit at (-sin a, cos a).
  return Math.atan2(-direction.x, direction.y);
}

function angleBetween(a: number, b: number): number {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

// Whether, from this Player's seated camera, another Player's held Hand
// stands in front of `point`.
function isBehindHand(
  point: CursorPosition,
  self: Seat3D,
  handAngles: number[],
  fanHalf: number
): boolean {
  const camera = {
    x: self.direction.x * CAMERA_DISTANCE,
    y: self.direction.y * CAMERA_DISTANCE
  };
  const d = { x: point.x - camera.x, y: point.y - camera.y };
  // Where the line of sight enters the circle the Hands stand on.
  const a = d.x * d.x + d.y * d.y;
  const b = 2 * (camera.x * d.x + camera.y * d.y);
  const c =
    camera.x * camera.x +
    camera.y * camera.y -
    HELD_HAND_DISTANCE * HELD_HAND_DISTANCE;
  const root = b * b - 4 * a * c;
  if (root < 0) return false;
  const t = (-b - Math.sqrt(root)) / (2 * a);
  if (t < 0 || t > 1) return false;
  const height = CAMERA_HEIGHT * (1 - t);
  if (height > HELD_HAND_HEIGHT + CARD_HEIGHT * 0.6) return false;
  const angle = angleOf({ x: camera.x + d.x * t, y: camera.y + d.y * t });
  return handAngles.some(hand => angleBetween(hand, angle) < fanHalf + 0.06);
}

/**
 * Where the dice, the chips and the duck start: in the gaps between seats,
 * clear of the decks, the trophies and the held Hands, in sight of this
 * Player's seat and preferably at the front corners of their view.
 *
 * @example
 * const spots = toySpots(seats, self); spots.dice.point;
 */
export function toySpots(
  seats: Seat3D[],
  self: Seat3D | null
): Record<ToyGroup, ToySpot> {
  const count = Math.max(seats.length, 3);
  const decks = [deckSpot('white', count), deckSpot('black', count)].map(
    deck => deck.point
  );
  const trophies = seats.map(seat => trophySpot(seat).point);
  const seatAngles = seats.map(seat => angleOf(seat.direction));
  const selfAngle = self ? angleOf(self.direction) : 0;
  // How far each held fan reaches round the rim either side of its seat.
  const fanHalf = (0.41 * Math.PI * 2) / count;
  const handAngles = seats
    .filter(seat => !seat.isSelf)
    .map(seat => angleOf(seat.direction));

  const candidates: { angle: number; point: CursorPosition; score: number }[] =
    [];
  for (let angle = -Math.PI; angle < Math.PI; angle += STEP) {
    const point = { x: -Math.sin(angle) * RING, y: Math.cos(angle) * RING };
    const distance = (spot: CursorPosition) =>
      Math.hypot(spot.x - point.x, spot.y - point.y);
    if (decks.some(deck => distance(deck) < 0.27)) continue;
    const seatClear = Math.min(
      Math.PI,
      ...seatAngles.map(seat => angleBetween(seat, angle))
    );
    const trophyClear = Math.min(1, ...trophies.map(distance));
    const score =
      -Math.abs(angleBetween(angle, selfAngle) - 1.05) +
      Math.min(seatClear - fanHalf, 0.15) * 3 -
      Math.max(0, 0.22 - trophyClear) * 4 -
      (self && isBehindHand(point, self, handAngles, fanHalf) ? 3 : 0);
    candidates.push({ angle, point, score });
  }
  candidates.sort((a, b) => b.score - a.score);

  const picked: (typeof candidates)[number][] = [];
  for (let index = 0; index < 3; index++) {
    const best =
      candidates.find(candidate =>
        picked.every(
          other =>
            Math.hypot(
              other.point.x - candidate.point.x,
              other.point.y - candidate.point.y
            ) > 0.3
        )
      ) ?? candidates[index];
    picked.push(best);
  }
  const spot = ({ angle, point }: (typeof candidates)[number]): ToySpot => ({
    point,
    tangent: { x: -Math.cos(angle), y: -Math.sin(angle) }
  });
  return {
    dice: spot(picked[0]),
    chips: spot(picked[1]),
    duck: spot(picked[2])
  };
}
