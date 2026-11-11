import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { CursorPosition } from '@/contracts';
import type { FeltCard } from '../../table/felt-cards';
import {
  ANSWER_LIFT,
  CARD_HEIGHT,
  CARD_THICKNESS,
  CARD_WIDTH,
  deckSpot,
  flatPose,
  seatPoint,
  trophySpot,
  type CardPose,
  type Seat3D
} from '../space';

// Where cards go, as springable targets. Pure helpers; the frame loop calls
// them every frame, so they write into an `out` target instead of allocating.

export type Space = 'world' | 'camera';

export type Target = {
  // 'camera': position and rotation are relative to the camera (this
  // Player's Hand, which follows any camera move).
  space: Space;
  position: Vector3;
  quaternion: Quaternion;
  scale: number;
};

/**
 * @example
 * const target = makeTarget();
 */
export function makeTarget(): Target {
  return {
    space: 'world',
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: 1
  };
}

const euler = new Euler(0, 0, 0, 'YXZ');

/**
 * Writes a shared `CardPose` into a target.
 *
 * @example
 * fromCardPose(out, playedPose(seat, 0, 1));
 */
export function fromCardPose(out: Target, pose: CardPose, scale = 1): Target {
  out.space = 'world';
  out.position.set(...pose.position);
  euler.set(pose.rotation[0], pose.rotation[1], pose.rotation[2], 'YXZ');
  out.quaternion.setFromEuler(euler);
  out.scale = scale;
  return out;
}

// How tall the draw piles are; the top card sits on this.
export const DECK_DEPTH = { white: 0.05, black: 0.032 } as const;

/**
 * A card on top of a draw pile, face down: where new cards come from.
 *
 * @example
 * deckTopPose('white', seats.length);
 */
export function deckTopPose(
  deck: 'white' | 'black',
  seatCount: number
): CardPose {
  const { point, yaw } = deckSpot(deck, seatCount);
  return flatPose(point, yaw, {
    faceDown: true,
    height: DECK_DEPTH[deck] + CARD_THICKNESS * 0.6
  });
}

/**
 * The discard: on the felt between the black deck and the centre, where
 * spent cards slide in and fade.
 *
 * @example
 * discardPose(seats.length, 3);
 */
export function discardPose(seatCount: number, salt = 0): CardPose {
  const { point, yaw } = deckSpot('black', seatCount);
  const jitter = jitterOf(salt);
  return flatPose(
    { x: point.x * 0.62 + jitter * 0.02, y: point.y * 0.62 - jitter * 0.015 },
    yaw + jitter * 0.4,
    { faceDown: true, height: 0.004 }
  );
}

/**
 * A card this Player picked, face up on the felt in front of them.
 *
 * @example
 * stagedPose(self, 0, 2);
 */
export function stagedPose(
  self: Pick<Seat3D, 'direction' | 'yaw'>,
  index: number,
  count: number
): CardPose {
  const side = (index - (count - 1) / 2) * CARD_WIDTH * STAGED_SCALE * 1.08;
  return flatPose(seatPoint(self, 0.44, side), self.yaw, {
    height: 0.006 + index * CARD_THICKNESS
  });
}
export const STAGED_SCALE = 1.45;

/**
 * Trophy `index` in a Player's pile of won Black Cards, face down, slightly
 * messy.
 *
 * @example
 * trophyPose(seat, 2);
 */
export function trophyPose(
  seat: Pick<Seat3D, 'direction' | 'yaw'>,
  index: number
): CardPose {
  const { point, yaw } = trophySpot(seat);
  const jitter = jitterOf(index + 1);
  return flatPose(
    { x: point.x + jitter * 0.012, y: point.y - jitter * 0.01 },
    yaw + jitter * 0.22,
    { faceDown: true, height: CARD_THICKNESS * (index + 0.5) }
  );
}

// Deterministic -1..1 noise, so a pile looks the same on every render.
function jitterOf(seed: number): number {
  const x = Math.sin(seed * 91.17 + 3.1) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * How big each card of a `count`-card answer is relative to its felt rect,
 * and where card `index` sits in it (reader frame: +x right, +y toward the
 * reader). The cards cascade from top left so together they fill the rect.
 *
 * @example
 * answerSlot(2, 1); // { fraction: 0.72, x: 0.14, y: 0.14 } (× rect size)
 */
export function answerSlot(count: number, index: number) {
  const fraction = count <= 1 ? 1 : count === 2 ? 0.66 : 0.56;
  const offset = count <= 1 ? 0 : (index - (count - 1) / 2) * (1 - fraction);
  return { fraction, x: offset / Math.max(count - 1, 1), y: offset };
}

/**
 * Card `index` of an answer on its felt rect, upright for the Judge.
 *
 * @example
 * answerPose(out, rects[2], 0, 1, isLifted);
 */
export function answerPose(
  out: Target,
  rect: FeltCard,
  index: number,
  count: number,
  isLifted: boolean
): Target {
  const { fraction } = answerSlot(count, index);
  const step = count <= 1 ? 0 : (1 - fraction) / (count - 1);
  const along = index - (count - 1) / 2;
  const ox = along * step * rect.width;
  const oy = along * step * rect.height;
  const angle = (rect.turnDeg * Math.PI) / 180;
  const point: CursorPosition = {
    x: rect.center.x + ox * Math.cos(angle) - oy * Math.sin(angle),
    y: rect.center.y + ox * Math.sin(angle) + oy * Math.cos(angle)
  };
  const height =
    0.004 + index * CARD_THICKNESS * 1.6 + (isLifted ? ANSWER_LIFT : 0);
  fromCardPose(
    out,
    flatPose(point, judgeYaw(rect), { height }),
    (fraction * rect.width) / CARD_WIDTH
  );
  return propUp(out, isLifted ? LIFTED_PROP : ANSWER_PROP);
}

// How far answers lean up toward their reader (radians). Seen from a seat a
// card flat on the felt is squashed to under half its height; propped on its
// near edge it reads at a glance, still clearly lying on the table.
const ANSWER_PROP = 0.3;
const LIFTED_PROP = 0.5;
export const STAGED_PROP = 0.3;

const propQuaternion = new Quaternion();
const propShift = new Vector3();
const X_AXIS = new Vector3(1, 0, 0);

/**
 * Leans a face-up card toward its reader by `angle`, pivoting on its near
 * (bottom) edge so that edge stays where it was.
 *
 * @example
 * propUp(fromCardPose(out, flatPose(point, yaw)), 0.3);
 */
export function propUp(out: Target, angle: number): Target {
  const half = (CARD_HEIGHT * out.scale) / 2;
  propShift
    .set(0, half * (Math.cos(angle) - 1), half * Math.sin(angle))
    .applyQuaternion(out.quaternion);
  out.position.add(propShift);
  out.quaternion.multiply(propQuaternion.setFromAxisAngle(X_AXIS, angle));
  return out;
}

/**
 * The yaw of the seat a felt rect reads upright from.
 *
 * @example
 * flatPose(rect.center, judgeYaw(rect));
 */
export function judgeYaw(rect: FeltCard): number {
  return Math.PI - (rect.turnDeg * Math.PI) / 180;
}

/**
 * (u, v) across a felt rect, 0–1 from its top left as the Judge reads it, for
 * a table-space point (the inverse of `pointOnCard`).
 *
 * @example
 * rectUV(rect, worldToTable(hit)); // { u: 0.3, v: 0.1 }
 */
export function rectUV(rect: FeltCard, point: CursorPosition) {
  const angle = (-rect.turnDeg * Math.PI) / 180;
  const dx = point.x - rect.center.x;
  const dy = point.y - rect.center.y;
  const x = dx * Math.cos(angle) - dy * Math.sin(angle);
  const y = dx * Math.sin(angle) + dy * Math.cos(angle);
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  return { u: clamp(x / rect.width + 0.5), v: clamp(y / rect.height + 0.5) };
}

const UP = new Vector3(0, 1, 0);
const lookMatrix = new Matrix4();
const rollQuaternion = new Quaternion();
const Z_AXIS = new Vector3(0, 0, 1);

/**
 * Turns a card at `out.position` to face `eye` (upright), then rolls it.
 *
 * @example
 * faceToward(out, camera.position, 0.02);
 * faceToward(out, eye, 0, screenUp); // upright on screen, even from above
 */
export function faceToward(
  out: Target,
  eye: Vector3,
  roll = 0,
  up: Vector3 = UP
): Target {
  lookMatrix.lookAt(eye, out.position, up);
  out.quaternion.setFromRotationMatrix(lookMatrix);
  if (roll !== 0) {
    rollQuaternion.setFromAxisAngle(Z_AXIS, roll);
    out.quaternion.multiply(rollQuaternion);
  }
  return out;
}

// The hero Black Card's size, per stage.
export const HERO_SCALE = { playing: 2, judging: 1.5, result: 1.7 } as const;
export const WINNER_SCALE = 1.35;

/**
 * The card size at which a Hand fills `fraction` of the view's height, and
 * the view's half extents, `depth` in front of a camera.
 *
 * @example
 * viewExtents(camera.fov, camera.aspect, 0.6);
 */
export function viewExtents(fov: number, aspect: number, depth: number) {
  const halfHeight = depth * Math.tan((fov * Math.PI) / 360);
  return { halfHeight, halfWidth: halfHeight * aspect };
}

export const CARD_ASPECT = CARD_HEIGHT / CARD_WIDTH;
