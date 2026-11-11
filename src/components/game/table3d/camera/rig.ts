import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CAMERA_TARGET_HEIGHT,
  CAMERA_TARGET_OFFSET,
  FELT_RADIUS
} from '../space';
import type { CameraView } from '../store';

// The camera is an orbit state around a look-at target: target (x, y, z),
// azimuth (angle of the camera around Y, 0 = on +Z), polar (angle from
// straight up) and distance. Everything here is plain numbers: no allocation
// per frame.

export type Pose = {
  x: number;
  y: number;
  z: number;
  az: number;
  pol: number;
  dist: number;
};
export type Channel = keyof Pose;
export const CHANNELS: Channel[] = ['x', 'y', 'z', 'az', 'pol', 'dist'];

export type Spring = { v: number; vel: number };
export type Springs = Record<Channel, Spring>;

export const MIN_DIST = 0.9;
export const MAX_DIST = 4;
export const MIN_POLAR = 0.02;
export const MAX_POLAR = 1.42;
// How far the target may be panned from the centre.
export const PAN_RADIUS = FELT_RADIUS * 0.85;

const TAU = Math.PI * 2;
const WIDE = 16 / 9;
// Half of the vertical field of view, as a tangent (CAMERA_FOV = 38).
const TAN_HALF_FOV = Math.tan((38 / 2) * (Math.PI / 180));

export function makePose(): Pose {
  return { x: 0, y: 0, z: 0, az: 0, pol: 0, dist: 0 };
}

export function makeSprings(): Springs {
  const springs = {} as Springs;
  for (const key of CHANNELS) springs[key] = { v: 0, vel: 0 };
  return springs;
}

/**
 * Critically damped step toward `goal` (frame-rate independent): the value
 * settles in about `time` seconds without overshooting.
 *
 * @example
 * smooth(spring, goal, 0.4, delta);
 */
export function smooth(
  spring: Spring,
  goal: number,
  time: number,
  delta: number
): number {
  const omega = 2 / Math.max(time, 0.0001);
  const x = omega * delta;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = spring.v - goal;
  const temp = (spring.vel + omega * change) * delta;
  spring.vel = (spring.vel - omega * temp) * decay;
  spring.v = goal + (change + temp) * decay;
  return spring.v;
}

/** The angle equal to `angle` (mod 2π) that is closest to `near`. */
export function unwrap(angle: number, near: number): number {
  return angle + TAU * Math.round((near - angle) / TAU);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Pull back on narrow or tall viewports so the table still fits. */
function fit(aspect: number): number {
  return aspect >= WIDE ? 1 : Math.pow(WIDE / aspect, 0.8);
}

/**
 * The seated pose of a Player whose seat lies along `direction` (table space).
 *
 * @example
 * seatPose(goal, { x: 0, y: 1 }, 16 / 9);
 */
export function seatPose(
  pose: Pose,
  direction: { x: number; y: number },
  aspect: number
): Pose {
  const ahead = CAMERA_DISTANCE - CAMERA_TARGET_OFFSET;
  const scale = fit(aspect);
  pose.x = direction.x * CAMERA_TARGET_OFFSET;
  const drop = CAMERA_HEIGHT - CAMERA_TARGET_HEIGHT;
  pose.y = CAMERA_TARGET_HEIGHT;
  pose.z = direction.y * CAMERA_TARGET_OFFSET;
  pose.az = Math.atan2(direction.x, direction.y);
  pose.pol = Math.atan2(ahead, drop);
  pose.dist = Math.hypot(ahead, drop) * scale;
  return pose;
}

/**
 * Straight down over the centre, this Player's seat at the bottom of the
 * screen (the camera sits on the seat's side, so screen-up points away).
 *
 * @example
 * topPose(goal, { x: 0, y: 1 }, 16 / 9);
 */
export function topPose(
  pose: Pose,
  direction: { x: number; y: number },
  aspect: number
): Pose {
  pose.x = 0;
  pose.y = 0;
  pose.z = 0;
  pose.az = Math.atan2(direction.x, direction.y);
  pose.pol = MIN_POLAR;
  const byWidth = 1.2 / (TAN_HALF_FOV * aspect);
  pose.dist = Math.max(3.7, byWidth);
  return pose;
}

export type StageKind =
  | 'lobby'
  | 'dealing'
  | 'playing'
  | 'judging'
  | 'result'
  | 'finished';

/**
 * How a stage nudges the seated framing, as offsets from the base pose
 * (world-space for the target).
 *
 * @example
 * stageOffsets(offsets, 'judging', self.direction, null);
 */
export function stageOffsets(
  out: Pose,
  kind: StageKind,
  direction: { x: number; y: number },
  winner: { x: number; y: number } | null
): Pose {
  out.x = out.y = out.z = out.az = out.pol = out.dist = 0;
  if (kind === 'lobby') {
    out.dist = 0.14;
    out.pol = 0.07;
  } else if (kind === 'judging') {
    // Rise and tilt down; slide the look-at back toward the answers.
    out.pol = -0.13;
    out.dist = -0.05;
    out.x = -direction.x * 0.1;
    out.z = -direction.y * 0.1;
  } else if (kind === 'result') {
    // Push in on the centre, drifting toward the winner.
    // Gently: a pawn the camera gets too close to fades out, and the winner
    // must stay on screen.
    out.dist = -0.16;
    out.y = 0.12;
    out.x = -direction.x * CAMERA_TARGET_OFFSET * 0.9;
    out.z = -direction.y * CAMERA_TARGET_OFFSET * 0.9;
    if (winner) {
      out.x += winner.x * 0.06;
      out.z += winner.y * 0.06;
    }
  } else if (kind === 'finished') {
    out.dist = 0.45;
    out.pol = -0.12;
  }
  return out;
}

export type Rig = {
  core: Springs;
  goal: Pose;
  offsets: Springs;
  offsetGoal: Pose;
  // Last frame's framing before the intro, for baking.
  out: Pose;
  weight: Spring;
  intro: Spring;
  view: CameraView;
  isReady: boolean;
  isIntroSkipped: boolean;
  introTime: number;
  spin: number;
};

export function makeRig(isIntro: boolean): Rig {
  return {
    core: makeSprings(),
    goal: makePose(),
    offsets: makeSprings(),
    offsetGoal: makePose(),
    out: makePose(),
    weight: { v: 0, vel: 0 },
    intro: { v: 1, vel: 0 },
    view: 'seat',
    isReady: false,
    isIntroSkipped: !isIntro,
    introTime: 0,
    spin: 0
  };
}

/**
 * Freezes the current framing into the core state, so leaving the seat view
 * (by hand or by button) continues from exactly where the camera is.
 *
 * @example
 * bake(rig); rig.view = 'free';
 */
export function bake(rig: Rig): void {
  for (const key of CHANNELS) {
    rig.core[key].v = rig.out[key];
    rig.core[key].vel = 0;
    rig.goal[key] = rig.out[key];
  }
  rig.weight.v = 0;
  rig.weight.vel = 0;
  rig.isIntroSkipped = true;
}
