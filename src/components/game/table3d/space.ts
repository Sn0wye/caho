import type { CursorPosition } from '@/contracts';
import type { TableSeat } from '../table/table-seats';

// The 3D table's world. Y is up and the felt is the plane y = 0, centred on the
// origin. Table space (the shared cursor space of ADR-0006: centre (0, 0), rim
// at radius 1, +y toward seat 0) maps straight onto it:
//
//   table (x, y)  →  world (x, 0, y)
//
// so one world unit is one table radius, and a cursor sent by a 2.5D client
// lands on the same spot of the felt here.

export type Vec3 = [x: number, y: number, z: number];

// Outer edge of the wooden rim.
export const TABLE_RADIUS = 1.06;
// Where the felt ends and the padded rim begins.
export const FELT_RADIUS = 0.95;
export const TABLE_THICKNESS = 0.07;
// The rim's padded top sits a little above the felt.
export const RIM_HEIGHT = 0.03;
export const FLOOR_Y = -0.8;

// A physical card. Same 2:3 aspect as the DOM cards.
export const CARD_WIDTH = 0.19;
export const CARD_HEIGHT = 0.285;
export const CARD_THICKNESS = 0.0018;
export const CARD_CORNER = 0.011;

// Where the other Players' pawns stand, measured from the centre.
export const SEAT_DISTANCE = 1.36;
// Where each other Player holds their Hand: a standing fan over the rim, backs
// to the table. See `heldHandSlot`.
export const HELD_HAND_DISTANCE = 1.0;
export const HELD_HAND_HEIGHT = 0.24;
// A face-down pile on the felt in front of each Player who already played.
export const PLAYED_DISTANCE = 0.56;
// The draw piles sit between seats, this far from the centre. See `deckSpot`.
export const DECK_DISTANCE = 0.76;
// How high the Judge lifts the answer under their cursor, and how high a held
// Hand card rises under its owner's cursor.
export const ANSWER_LIFT = 0.09;
export const HELD_CARD_LIFT = 0.035;

// The seated camera, relative to this Player's seat direction.
export const CAMERA_FOV = 38;
export const CAMERA_DISTANCE = 3.0;
export const CAMERA_HEIGHT = 1.36;
// The point on the felt the seated camera looks at, toward the viewer.
export const CAMERA_TARGET_OFFSET = 0.3;
// How high above the felt that point is: aiming a little up keeps the far
// Players' heads and names in frame.
export const CAMERA_TARGET_HEIGHT = 0.1;

/**
 * A table-space point as a world position, `height` above the felt.
 *
 * @example
 * tableToWorld({ x: 0, y: 1 }); // [0, 0, 1]: the rim in front of seat 0
 */
export function tableToWorld(point: CursorPosition, height = 0): Vec3 {
  return [point.x, height, point.y];
}

/**
 * The table-space point under a world position.
 *
 * @example
 * worldToTable([0.2, 0.5, -0.1]); // { x: 0.2, y: -0.1 }
 */
export function worldToTable(world: { x: number; z: number }): CursorPosition {
  return { x: world.x, y: world.z };
}

export type Seat3D = TableSeat & {
  index: number;
  isSelf: boolean;
  // Unit vector from the centre toward the seat, in table space.
  direction: CursorPosition;
  // rotation.y that turns an object's local +Z toward the table centre.
  yaw: number;
  // Where the pawn stands, on the floor plane (y is up to the caller).
  world: Vec3;
};

/**
 * Adds the 3D facts to the shared seating (same order and colours as the 2.5D
 * table, so cursors and seats match across layouts).
 *
 * @example
 * const seats = toSeats3D(arrangeSeats(players, null).seats, userId);
 */
export function toSeats3D(seats: TableSeat[], selfId: string | null): Seat3D[] {
  return seats.map((seat, index) => {
    const length = Math.hypot(seat.position.x, seat.position.y) || 1;
    const direction = {
      x: seat.position.x / length,
      y: seat.position.y / length
    };
    return {
      ...seat,
      index,
      isSelf: seat.player.id === selfId,
      direction,
      yaw: Math.atan2(-direction.x, -direction.y),
      world: [direction.x * SEAT_DISTANCE, 0, direction.y * SEAT_DISTANCE]
    };
  });
}

/**
 * A table-space point at `distance` from the centre toward a seat, shifted
 * `side` to the right as that seat's Player sees the table.
 *
 * @example
 * seatPoint(seat, PLAYED_DISTANCE); // on the felt in front of the seat
 * seatPoint(seat, 0.5, 0.2); // same, a little to that Player's right
 */
export function seatPoint(
  seat: Pick<Seat3D, 'direction'>,
  distance: number,
  side = 0
): CursorPosition {
  const { x, y } = seat.direction;
  // The Player looks along -direction, so their right is (y, -x).
  return { x: x * distance + y * side, y: y * distance - x * side };
}

/**
 * Turns a spot written from seat 0's point of view (x to that Player's right,
 * y toward them) into table space for `seat`, e.g. to keep something on this
 * Player's left whichever seat they have.
 *
 * @example
 * fromSeatView({ x: -0.3, y: 0.2 }, selfSeat); // front left of this Player
 */
export function fromSeatView(
  spot: CursorPosition,
  seat: Pick<Seat3D, 'direction'>
): CursorPosition {
  return seatPoint(seat, spot.y, spot.x);
}

// A pose for a card. Cards are modelled in their local XY plane: face (text)
// toward +Z, back toward -Z, top toward +Y. `rotation` is an Euler in 'YXZ'
// order: [tilt about X, yaw about Y, roll about Z].
export type CardPose = { position: Vec3; rotation: Vec3 };

const FLAT = -Math.PI / 2;

/**
 * A card lying flat at a table-space point, readable from the seat with
 * `readerYaw` (see Seat3D.yaw), `height` above the felt.
 *
 * @example
 * flatPose({ x: 0, y: 0 }, self.yaw); // face up in the centre, upright for me
 * flatPose(spot, seat.yaw, { faceDown: true, height: 0.01 });
 */
export function flatPose(
  point: CursorPosition,
  readerYaw: number,
  { faceDown = false, height = 0 }: { faceDown?: boolean; height?: number } = {}
): CardPose {
  // Face up: tilt -90° turns the face (+Z) up and the top (+Y) toward local
  // -Z, which the half turn points away from the reader. Face down: tilt +90°
  // sends the top toward local +Z, already away from the reader.
  return faceDown
    ? { position: tableToWorld(point, height), rotation: [-FLAT, readerYaw, 0] }
    : {
        position: tableToWorld(point, height),
        rotation: [FLAT, readerYaw + Math.PI, 0]
      };
}

/**
 * Where card `slot` of a `size`-card Hand stands in another Player's grip:
 * a fan over the rim in front of their pawn, faces toward them, slot 0 on
 * their left. The cards layer draws it and the players layer points cursors
 * at it, so both must use this.
 *
 * @example
 * heldHandSlot(seat, cursor.card, handSize(seat.player.id), seats.length);
 */
export function heldHandSlot(
  seat: Pick<Seat3D, 'direction' | 'yaw'>,
  slot: number,
  size: number,
  seatCount: number,
  lifted = false
): CardPose {
  // Share the rim: more Players, tighter fans.
  const arc = (2 * Math.PI * HELD_HAND_DISTANCE) / Math.max(seatCount, 3);
  const step = Math.min(
    0.062,
    (arc * 0.82 - CARD_WIDTH) / Math.max(size - 1, 1)
  );
  const fromMiddle = slot - (size - 1) / 2;
  // The ends curl back toward the owner and drop a little, like a real fan.
  const curl = fromMiddle * fromMiddle * 0.0035;
  const point = seatPoint(
    seat,
    HELD_HAND_DISTANCE + curl + slot * 0.0025,
    fromMiddle * step
  );
  return {
    position: tableToWorld(
      point,
      HELD_HAND_HEIGHT - curl * 0.6 + (lifted ? HELD_CARD_LIFT : 0)
    ),
    // Face toward the owner, leaning back so they can read it.
    rotation: [-0.32, seat.yaw + Math.PI, -fromMiddle * 0.045]
  };
}

/**
 * The face-down pile in front of a Player who already played; `index` spreads
 * a pick-2/3 answer sideways.
 *
 * @example
 * playedPose(seat, 0, 2); playedPose(seat, 1, 2);
 */
export function playedPose(
  seat: Pick<Seat3D, 'direction' | 'yaw'>,
  index = 0,
  count = 1
): CardPose {
  const side = (index - (count - 1) / 2) * CARD_WIDTH * 0.55;
  return flatPose(seatPoint(seat, PLAYED_DISTANCE, side), seat.yaw, {
    faceDown: true,
    height: CARD_THICKNESS * (index + 0.5)
  });
}

/**
 * Where a draw pile sits: in the gap on either side of seat 0, the same
 * table-space spot on every screen. `yaw` turns the pile to face the centre.
 *
 * @example
 * deckSpot('white', seats.length); deckSpot('black', seats.length);
 */
export function deckSpot(
  deck: 'white' | 'black',
  seatCount: number
): { point: CursorPosition; yaw: number } {
  const gap = Math.PI / Math.max(seatCount, 3);
  const angle = deck === 'white' ? gap : -gap;
  const direction = { x: -Math.sin(angle), y: Math.cos(angle) };
  return {
    point: { x: direction.x * DECK_DISTANCE, y: direction.y * DECK_DISTANCE },
    yaw: Math.atan2(-direction.x, -direction.y)
  };
}

/**
 * Where a Player's trophies (the Black Cards they won, one per point) pile up:
 * on the felt at their front right.
 *
 * @example
 * trophySpot(seat); // { point, yaw }
 */
export function trophySpot(seat: Pick<Seat3D, 'direction' | 'yaw'>): {
  point: CursorPosition;
  yaw: number;
} {
  return { point: seatPoint(seat, 0.76, 0.3), yaw: seat.yaw };
}

/**
 * How solid something standing around the table should be drawn: 1 (solid) or
 * 0 (gone), with a short ramp between. A pawn or held Hand right next to the
 * camera would wall off the felt, so it disappears; from above nothing is in
 * the way, so the camera's height counts too. The players and cards layers
 * both use this, so a pawn and its Hand go together.
 *
 * @example
 * const fade = nearCameraFade(camera.position, seat.world);
 * group.visible = fade > 0.01; material.opacity = fade;
 */
export function nearCameraFade(
  camera: { x: number; y: number; z: number },
  point: Vec3
): number {
  // Measured to about head height, whatever `point`'s own y is.
  const distance = Math.hypot(
    camera.x - point[0],
    camera.y - 0.4,
    camera.z - point[2]
  );
  const t = Math.min(1, Math.max(0, (distance - 2.52) / 0.16));
  return t * t * (3 - 2 * t);
}
