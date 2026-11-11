import {
  Color,
  Matrix4,
  Quaternion,
  Vector3,
  type Camera,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial
} from 'three';
import type { WhiteCard } from '@/schemas';
import type { CardKind, FaceSpec } from './art';
import { makeTarget, type Target } from './poses';

// One physical card. It never teleports: each frame it chases the target of
// its active step, flying in an arc on real trips and springing on small
// moves (hover, a Hand closing up, the hero's bob).

export type FrameContext = {
  now: number;
  dt: number;
  camera: Camera & { fov?: number; aspect?: number };
  // Updated from the Room each frame (cursors, hover), never React state.
  hoveredHandId: string | null;
  hoveredHandSlot: number | null;
  hoveredAnswer: number | null;
  liftedAnswer: number | null;
  chosenAnswer: number | null;
  // Other Players' Hand slot under their cursor, by Player id.
  heldLift: Map<string, number>;
  // How solid each other Player's Hand is drawn (`nearCameraFade`), by id.
  seatFade: Map<string, number>;
};

export type Aim = (ctx: FrameContext, out: Target) => void;

export type CardFx =
  | 'card-deal'
  | 'card-slide'
  | 'card-flip'
  | 'card-hover'
  | 'card-select';

// A step starts at `at` (seconds, same clock as FrameContext.now) and holds
// until the next one. A leaving step flies the card off and fades it out.
export type Step = {
  at: number;
  aim: Aim;
  isLeaving?: boolean;
  fx?: CardFx;
};

export type Glow = { color: string; strength: number } | null;

// What the card is for, which decides what pointer input does to it.
export type Role =
  | {
      type: 'hand';
      slot: number;
      size: number;
      isHoverable: boolean;
      isSelectable: boolean;
    }
  | { type: 'staged'; isClickable: boolean }
  | { type: 'answer'; index: number }
  | null;

type Flight = {
  from: Vector3;
  fromQuaternion: Quaternion;
  fromScale: number;
  start: number;
  duration: number;
  arc: number;
};

const SPRING = 240;
// Critically damped: cards settle, they don't bounce.
const DAMPING = 2 * Math.sqrt(SPRING);
// This Player's Hand answers the pointer at once, like flicking through real
// cards: a much stiffer spring, settled in about a tenth of a second.
const HAND_SPRING = 1400;
const HAND_DAMPING = 2 * Math.sqrt(HAND_SPRING);

const tmp = makeTarget();
const matrix = new Matrix4();
const inverse = new Matrix4();
const scaleVector = new Vector3();
const delta = new Vector3();

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export class CardEntity {
  readonly id: string;
  kind: CardKind;
  face: FaceSpec;
  // Overrides `face` per frame (the hero shows the answer in focus).
  faceFn: ((ctx: FrameContext) => FaceSpec) | null = null;
  glowFn: ((ctx: FrameContext) => Glow) | null = null;
  role: Role = null;
  // This Player's own card behind it, for select / unselect.
  card: WhiteCard | null = null;
  // A freshly dealt card waits on the deck (hidden) until then.
  readyAt = 0;
  // Ignores the pointer until then (an answer still face down in the pile).
  interactiveAt = 0;
  // Where it goes when nothing claims it any more.
  sink: Aim;
  // Face texture glow: 1 in this Player's Hand, a touch on the table.
  emissive = 0.06;
  // Dim (0–1) multiplier, e.g. a Judge's Hand.
  dim = 1;
  // The Player holding it, for a Hand that fades near the camera.
  seatId: string | null = null;
  isCastingShadow = true;
  // This Player's Hand draws over the world (see CardMesh).
  isOverlay = false;
  renderOrder = 0;

  steps: Step[] = [];
  private activeStep: Step | null = null;
  private aim: Aim | null = null;

  space: Target['space'] = 'world';
  readonly position = new Vector3();
  readonly quaternion = new Quaternion();
  scale = 1;
  private readonly velocity = new Vector3();
  private scaleVelocity = 0;
  private flight: Flight | null = null;
  private readonly last = makeTarget();
  private hasLast = false;

  isBorn = false;
  isLeaving = false;
  isGone = false;
  opacity = 1;
  glowOpacity = 0;
  readonly glowColor = new Color();
  // Pose in world space this frame (camera-space cards resolved).
  readonly world = new Matrix4();

  mesh: Mesh | null = null;
  glowMesh: Mesh | null = null;
  faceMaterial: MeshStandardMaterial | null = null;
  // The mesh's [face, back] pair, reused every frame.
  readonly materials: MeshStandardMaterial[] = [];
  glowMaterial: MeshBasicMaterial | null = null;
  fadeMaterials: MeshStandardMaterial[] | null = null;
  appliedFaceKey: string | null = null;

  constructor(
    id: string,
    kind: CardKind,
    face: FaceSpec,
    spawn: Target,
    sink: Aim
  ) {
    this.id = id;
    this.kind = kind;
    this.face = face;
    this.sink = sink;
    this.space = spawn.space;
    this.position.copy(spawn.position);
    this.quaternion.copy(spawn.quaternion);
    this.scale = spawn.scale;
  }

  setSteps(steps: Step[]) {
    this.steps = steps.map(step =>
      step.at < this.readyAt ? { ...step, at: this.readyAt } : step
    );
    this.activeStep = null;
  }

  leave(now: number) {
    if (this.isLeaving) return;
    this.setSteps([{ at: now, aim: this.sink, isLeaving: true }]);
  }

  // Back from the dead: a leaving card claimed again before it vanished.
  revive() {
    this.isLeaving = false;
  }

  update(ctx: FrameContext) {
    const { now } = ctx;
    let active: Step | null = null;
    for (const step of this.steps) if (step.at <= now) active = step;

    if (active && active !== this.activeStep) {
      this.activeStep = active;
      this.aim = active.aim;
      this.activate(active, ctx);
    }
    if (!this.isBorn) return;

    const aim = this.aim;
    if (aim) {
      aim(ctx, tmp);
      if (tmp.space !== this.space) this.moveToSpace(tmp.space, ctx.camera);
      this.last.space = tmp.space;
      this.last.position.copy(tmp.position);
      this.last.quaternion.copy(tmp.quaternion);
      this.last.scale = tmp.scale;
      this.hasLast = true;
    }
    if (!this.hasLast) return;
    const target = this.last;
    const dt = Math.min(ctx.dt, 1 / 30);

    const flight = this.flight;
    if (flight) {
      const t = Math.min(1, (now - flight.start) / flight.duration);
      // No overshoot: a card slides to its place and stops.
      const move = easeOut(t);
      this.position.lerpVectors(flight.from, target.position, move);
      this.position.y += Math.sin(Math.PI * Math.min(1, t * 1.08)) * flight.arc;
      this.quaternion.slerpQuaternions(
        flight.fromQuaternion,
        target.quaternion,
        easeInOut(t)
      );
      this.scale =
        flight.fromScale + (target.scale - flight.fromScale) * easeOut(t);
      if (this.isLeaving) this.opacity = 1 - smoothstep(0.35, 1, t);
      if (t >= 1) {
        this.flight = null;
        this.velocity.set(0, 0, 0);
        this.scaleVelocity = 0;
        if (this.isLeaving) this.isGone = true;
      }
    } else {
      const isHand = this.space === 'camera';
      const spring = isHand ? HAND_SPRING : SPRING;
      const damping = isHand ? HAND_DAMPING : DAMPING;
      delta.subVectors(target.position, this.position);
      this.velocity.addScaledVector(delta, spring * dt);
      this.velocity.multiplyScalar(Math.max(0, 1 - damping * dt));
      this.position.addScaledVector(this.velocity, dt);
      this.quaternion.slerp(
        target.quaternion,
        1 - Math.exp(-(isHand ? 34 : 16) * dt)
      );
      this.scaleVelocity += (target.scale - this.scale) * spring * dt;
      this.scaleVelocity *= Math.max(0, 1 - damping * dt);
      this.scale += this.scaleVelocity * dt;
      if (this.isLeaving) this.isGone = true;
      if (!this.isLeaving && this.opacity < 1) {
        this.opacity = Math.min(1, this.opacity + dt * 3);
      }
    }
  }

  // Resolves this frame's pose to world space.
  resolve(camera: Camera) {
    scaleVector.setScalar(this.scale);
    this.world.compose(this.position, this.quaternion, scaleVector);
    if (this.space === 'camera') {
      this.world.premultiply(camera.matrixWorld);
    }
    return this.world;
  }

  private activate(step: Step, ctx: FrameContext) {
    step.aim(ctx, tmp);
    if (step.isLeaving) this.isLeaving = true;
    else if (this.isLeaving) this.revive();

    if (!this.isBorn) {
      this.isBorn = true;
      this.startFlight(ctx, tmp);
      return;
    }
    const isSame =
      this.hasLast &&
      tmp.space === this.last.space &&
      tmp.position.distanceTo(this.last.position) < 0.012 &&
      tmp.quaternion.angleTo(this.last.quaternion) < 0.12 &&
      Math.abs(tmp.scale - this.last.scale) < 0.04;
    if (!isSame || step.isLeaving) this.startFlight(ctx, tmp);
  }

  // Read and cleared by the world, which throttles and emits it.
  pendingFx: CardFx | null = null;

  private startFlight(ctx: FrameContext, target: Target) {
    if (target.space !== this.space) this.moveToSpace(target.space, ctx.camera);
    const distance = this.position.distanceTo(target.position);
    const turn = this.quaternion.angleTo(target.quaternion);
    const isFlip = turn > Math.PI * 0.55;
    const isCamera = target.space === 'camera';
    // A low arc: enough to clear the felt, not a throw.
    let arc = distance > 0.14 ? Math.min(0.09, 0.015 + distance * 0.08) : 0;
    if (isFlip)
      arc = Math.max(arc, 0.05 + 0.05 * Math.max(this.scale, target.scale));
    if (isCamera) arc *= 0.25;
    this.flight = {
      from: this.position.clone(),
      fromQuaternion: this.quaternion.clone(),
      fromScale: this.scale,
      start: ctx.now,
      duration: Math.min(
        0.42,
        0.14 + distance * 0.2 + (isFlip ? 0.08 : 0) + turn * 0.02
      ),
      arc
    };
    if (this.activeStep?.fx && !this.pendingFx)
      this.pendingFx = this.activeStep.fx;
  }

  private moveToSpace(space: Target['space'], camera: Camera) {
    scaleVector.setScalar(this.scale);
    matrix.compose(this.position, this.quaternion, scaleVector);
    if (space === 'camera') {
      inverse.copy(camera.matrixWorld).invert();
      matrix.premultiply(inverse);
    } else {
      matrix.premultiply(camera.matrixWorld);
    }
    matrix.decompose(this.position, this.quaternion, scaleVector);
    this.scale = scaleVector.x;
    this.space = space;
    this.velocity.set(0, 0, 0);
    if (this.flight) {
      // Re-express the flight's origin in the new space too.
      scaleVector.setScalar(this.flight.fromScale);
      matrix.compose(this.flight.from, this.flight.fromQuaternion, scaleVector);
      matrix.premultiply(space === 'camera' ? inverse : camera.matrixWorld);
      matrix.decompose(
        this.flight.from,
        this.flight.fromQuaternion,
        scaleVector
      );
      this.flight.fromScale = scaleVector.x;
    }
  }
}
