import type { CursorPosition } from '@/contracts';

// How the 2.5D table is drawn. The table is a flat disc tilted back by
// `tiltDeg` (CSS rotateX) under a `perspective` viewpoint that sits right above
// its centre, then spun (rotateZ) so this Player's seat is at the bottom.
// Everything shared between clients (seats, cursors) lives in table space:
// centre (0, 0), rim at radius 1, +y toward seat 0. The backend relays cursors
// in that space (ADR-0006), so each client only needs this module to go from
// its own screen to the shared table and back.
export type TableView = {
  // Table radius on screen before tilt, px.
  radius: number;
  // CSS `perspective`, px.
  perspective: number;
  tiltDeg: number;
  spinDeg: number;
};

export type ScreenPoint = { x: number; y: number };

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Where seat `index` of `count` sits in table space: evenly around the table,
 * seat 0 at the bottom, going clockwise.
 *
 * @example
 * seatPosition(0, 4, 1.3); // { x: 0, y: 1.3 }
 */
export function seatPosition(
  index: number,
  count: number,
  distance: number
): CursorPosition {
  const angle = seatAngle(index, count);
  return { x: -Math.sin(angle) * distance, y: Math.cos(angle) * distance };
}

/**
 * The table's spin, in degrees, that brings seat `index` to the bottom of the
 * screen.
 *
 * @example
 * spinForSeat(1, 4); // -90: seat 1 starts on the left, so turn the table back
 */
export function spinForSeat(index: number, count: number): number {
  return (-seatAngle(index, count) * 180) / Math.PI;
}

function seatAngle(index: number, count: number): number {
  return count > 0 ? (2 * Math.PI * index) / count : 0;
}

/**
 * The table-space point under a screen point, or null above the horizon.
 * `point` is relative to the table's centre on screen, which is also the
 * perspective origin. Inverts rotateX(tilt) then rotateZ(spin) under CSS
 * perspective.
 *
 * @example
 * screenToTable({ x: 0, y: 0 }, view); // { x: 0, y: 0 }
 */
export function screenToTable(
  point: ScreenPoint,
  view: TableView
): CursorPosition | null {
  const tilt = toRad(view.tiltDeg);
  const p = view.perspective;
  // A tilted-plane point (u, v) lands at depth z = v·sin(tilt), so on screen
  // y = v·cos(tilt)·p / (p − z). Solved for v:
  const denominator = p * Math.cos(tilt) + point.y * Math.sin(tilt);
  if (denominator <= 0) return null;
  const v = (p * point.y) / denominator;
  const u = (point.x * (p - v * Math.sin(tilt))) / p;
  return unspin({ x: u / view.radius, y: v / view.radius }, view.spinDeg);
}

/**
 * Where a table-space point lands on screen, relative to the table's centre,
 * plus its perspective `scale` (above 1 nearer the viewer). The forward of
 * screenToTable, for things drawn over the scene instead of on the felt.
 *
 * @example
 * tableToScreen({ x: 0, y: 1 }, view); // the near rim: { x: 0, y: 260, scale: 1.2 }
 */
export function tableToScreen(
  point: CursorPosition,
  view: TableView
): ScreenPoint & { scale: number } {
  const tilt = toRad(view.tiltDeg);
  const spin = toRad(view.spinDeg);
  const u = (point.x * Math.cos(spin) - point.y * Math.sin(spin)) * view.radius;
  const v = (point.x * Math.sin(spin) + point.y * Math.cos(spin)) * view.radius;
  const scale = view.perspective / (view.perspective - v * Math.sin(tilt));
  return { x: u * scale, y: v * Math.cos(tilt) * scale, scale };
}

// The world layer is drawn with rotateZ(spin); undo it.
function unspin(point: CursorPosition, spinDeg: number): CursorPosition {
  const spin = toRad(spinDeg);
  const cos = Math.cos(spin);
  const sin = Math.sin(spin);
  return {
    x: point.x * cos + point.y * sin,
    y: -point.x * sin + point.y * cos
  };
}

/**
 * Whether a table-space point is close enough to the table to be worth
 * showing; the backend rejects anything past ±2.
 *
 * @example
 * isOnTable({ x: 0, y: 1.4 }); // true, hovering a seat
 */
export function isOnTable(point: CursorPosition): boolean {
  return Math.abs(point.x) <= 1.9 && Math.abs(point.y) <= 1.9;
}
