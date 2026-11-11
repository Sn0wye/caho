'use client';

import { createContext, useContext } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import {
  Euler,
  Plane,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
  type Camera
} from 'three';
import { FLOOR_Y, type Vec3 } from '../space';
import { fx, useTable3D } from '../store';
import { DIE_FACE_VALUES } from './toy-textures';

export type ToyKind = 'die' | 'chip' | 'duck';

export const GRAVITY = -15;
// Where a held toy floats, above the felt.
const HOVER_HEIGHT = 0.2;
// How far from the centre a held toy may go: past the rim, so it can be
// dropped off the table on purpose.
const MAX_REACH = 1.3;
// Speed caps (units/s). With CCD on, these keep thin chips from tunnelling.
const MAX_DRAG_SPEED = 6;
const MAX_THROW_SPEED = 4;
const MAX_SPEED = 8;
// Impacts below this change of velocity are resting contact, not a clack.
const MIN_IMPACT = 0.45;
const HIT_INTERVAL_MS = 70;
// Off the table for this long (or this far away) and it comes back.
const LOST_SECONDS = 1.1;
const LOST_DISTANCE = 3;

export type Toy = {
  kind: ToyKind;
  body: RapierRigidBody | null;
  // Where it rests at spawn, centre height included.
  home: Vec3;
  // Moved by hand since spawn: from then on a seat change won't move it home.
  isTouched: boolean;
  // A die rolled or thrown and not yet at rest: show its value when it stops.
  isRolling: boolean;
  restFor: number;
  lostFor: number;
  lastHitAt: number;
  velocityBefore: Vector3;
  onSettle?: (value: number) => void;
};

type PointerCapture = {
  setPointerCapture: (pointerId: number) => void;
  releasePointerCapture: (pointerId: number) => void;
};

type Drag = {
  toy: Toy;
  pointerId: number;
  pointer: Vector2;
  startHeight: number;
  heldFor: number;
  release: () => void;
};

const up = new Vector3(0, 1, 0);
const temp = {
  target: new Vector3(),
  position: new Vector3(),
  velocity: new Vector3(),
  desired: new Vector3(),
  spin: new Vector3(),
  axis: new Vector3(),
  bodyUp: new Vector3(),
  quaternion: new Quaternion(),
  euler: new Euler(),
  ray: new Raycaster(),
  plane: new Plane(new Vector3(0, 1, 0), 0)
};

function clampLength(vector: Vector3, max: number) {
  const length = vector.length();
  if (length > max) vector.multiplyScalar(max / length);
  return vector;
}

function randomSpin(target: Vector3, speed: number) {
  return target
    .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .normalize()
    .multiplyScalar(speed);
}

/**
 * The value on top of a die with this rotation.
 *
 * @example
 * faceUp(body.rotation()); // 1..6
 */
export function faceUp(rotation: {
  x: number;
  y: number;
  z: number;
  w: number;
}): number {
  const q = temp.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  const axes: Vec3[] = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ];
  let best = 0;
  let bestY = -Infinity;
  axes.forEach((axis, index) => {
    const y = temp.axis.set(...axis).applyQuaternion(q).y;
    if (y > bestY) {
      bestY = y;
      best = index;
    }
  });
  return DIE_FACE_VALUES[best];
}

// Every toy on the table, the one in the hand, and the per-step physics that
// isn't plain Rapier: dragging, throwing, impact sounds, respawning.
export class ToyWorld {
  toys = new Set<Toy>();
  drag: Drag | null = null;
  getCamera: () => Camera | null = () => null;
  canvas: HTMLElement | null = null;
  // Toys settle for a moment after spawning: not worth a clack.
  private quietUntil = performance.now() + 1500;

  /** A new toy; it takes part once `register`ed. */
  create(kind: ToyKind, home: Vec3): Toy {
    return {
      kind,
      body: null,
      home,
      isTouched: false,
      isRolling: false,
      restFor: 0,
      lostFor: 0,
      lastHitAt: 0,
      velocityBefore: new Vector3()
    };
  }

  /** Adds a toy; returns the cleanup that removes it. */
  register(toy: Toy) {
    this.toys.add(toy);
    return () => {
      if (this.drag?.toy === toy) this.release();
      this.toys.delete(toy);
    };
  }

  private setCursor(cursor: string) {
    if (this.canvas) this.canvas.style.cursor = cursor;
  }

  private updatePointer(clientX: number, clientY: number) {
    if (!this.drag || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.drag.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
  }

  /** R3F handlers for a toy's meshes. */
  handlers(toy: Toy) {
    return {
      onPointerDown: (event: ThreeEvent<PointerEvent>) => {
        if (event.button !== 0) return;
        event.stopPropagation();
        this.grab(toy, event);
      },
      onPointerOver: (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        if (!this.drag) this.setCursor('grab');
      },
      onPointerOut: () => {
        if (!this.drag) this.setCursor('');
      },
      onClick: (event: ThreeEvent<MouseEvent>) => event.stopPropagation(),
      onDoubleClick: (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if (toy.kind === 'die') this.roll(toy);
      }
    };
  }

  grab(toy: Toy, event: ThreeEvent<PointerEvent>) {
    const body = toy.body;
    if (!body) return;
    if (this.drag) this.release();

    // R3F's capture: the drag keeps its events after leaving the mesh.
    const capture = event.target as unknown as PointerCapture;
    capture.setPointerCapture(event.pointerId);
    const onMove = (move: PointerEvent) => {
      if (move.pointerId === drag.pointerId) {
        this.updatePointer(move.clientX, move.clientY);
      }
    };
    const onUp = (pointer: PointerEvent) => {
      if (pointer.pointerId === drag.pointerId) this.release();
    };
    const onBlur = () => this.release();
    const onHidden = () => document.hidden && this.release();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onHidden);

    const drag: Drag = {
      toy,
      pointerId: event.pointerId,
      pointer: new Vector2(),
      startHeight: body.translation().y,
      heldFor: 0,
      release: () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        window.removeEventListener('blur', onBlur);
        document.removeEventListener('visibilitychange', onHidden);
        capture.releasePointerCapture(event.pointerId);
      }
    };
    this.drag = drag;
    this.updatePointer(event.nativeEvent.clientX, event.nativeEvent.clientY);

    toy.isTouched = true;
    toy.isRolling = false;
    body.wakeUp();
    this.setCursor('grabbing');
    useTable3D.getState().setDragging(true);
    fx.emit({ type: 'toy-grab' });
  }

  release() {
    const drag = this.drag;
    if (!drag) return;
    this.drag = null;
    drag.release();
    this.setCursor('');
    useTable3D.getState().setDragging(false);

    const { toy } = drag;
    const body = toy.body;
    if (!body) return;
    // The hand's velocity carries over: a flick is a throw.
    const velocity = clampLength(
      temp.velocity.copy(body.linvel()),
      MAX_THROW_SPEED
    );
    const speed = Math.hypot(velocity.x, velocity.z);
    if (toy.kind === 'die') {
      body.setAngvel(randomSpin(temp.spin, 10 + speed * 7), true);
      toy.isRolling = true;
      toy.restFor = 0;
    } else if (speed > 1) {
      body.setAngvel(randomSpin(temp.spin, speed * 2), true);
    }
    body.setLinvel(velocity, true);
  }

  /** A quick roll in place: pop up with a random spin. */
  roll(toy: Toy) {
    const body = toy.body;
    if (!body || this.drag?.toy === toy) return;
    toy.isTouched = true;
    toy.isRolling = true;
    toy.restFor = 0;
    body.setLinvel(
      {
        x: (Math.random() - 0.5) * 0.4,
        y: 2.1,
        z: (Math.random() - 0.5) * 0.4
      },
      true
    );
    body.setAngvel(randomSpin(temp.spin, 22 + Math.random() * 10), true);
  }

  /** Drops a toy back onto the felt over its home. */
  respawn(toy: Toy) {
    const body = toy.body;
    if (!body) return;
    if (this.drag?.toy === toy) this.release();
    const [x, y, z] = toy.home;
    const jitter = () => (Math.random() - 0.5) * 0.02;
    body.setTranslation(
      { x: x + jitter(), y: y + 0.14, z: z + jitter() },
      true
    );
    const rotation =
      toy.kind === 'die'
        ? temp.euler.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          )
        : temp.euler.set(0, Math.random() * Math.PI * 2, 0);
    body.setRotation(temp.quaternion.setFromEuler(rotation), true);
    body.setLinvel({ x: 0, y: -0.3, z: 0 }, true);
    body.setAngvel(
      toy.kind === 'die' ? randomSpin(temp.spin, 6) : { x: 0, y: 0, z: 0 },
      true
    );
    toy.lostFor = 0;
    toy.isRolling = toy.kind === 'die';
    toy.restFor = 0;
  }

  /** Before each physics step: remember velocities and drive the held toy. */
  beforeStep(dt: number) {
    for (const toy of this.toys) {
      const body = toy.body;
      if (!body) continue;
      if (body.isSleeping()) toy.velocityBefore.set(0, 0, 0);
      else toy.velocityBefore.copy(body.linvel());
    }
    const drag = this.drag;
    const body = drag?.toy.body;
    const camera = this.getCamera();
    if (!drag || !body || !camera) return;

    drag.heldFor += dt;
    const lift = 1 - Math.pow(1 - Math.min(drag.heldFor / 0.18, 1), 3);
    const height = drag.startHeight + (HOVER_HEIGHT - drag.startHeight) * lift;

    // Follow the pointer on a horizontal plane at the hover height.
    const { target, position, velocity, desired, spin, axis, bodyUp } = temp;
    temp.ray.setFromCamera(drag.pointer, camera);
    temp.plane.constant = -HOVER_HEIGHT;
    const position3 = body.translation();
    position.set(position3.x, position3.y, position3.z);
    if (!temp.ray.ray.intersectPlane(temp.plane, target)) {
      target.copy(position);
    }
    const reach = Math.hypot(target.x, target.z);
    if (reach > MAX_REACH) target.multiplyScalar(MAX_REACH / reach);
    target.y = height;

    // Velocity drive, not teleporting: it swings, bumps and keeps momentum.
    clampLength(
      desired.subVectors(target, position).multiplyScalar(16),
      MAX_DRAG_SPEED
    );
    const blend = 1 - Math.exp(-dt * 28);
    velocity.copy(body.linvel()).lerp(desired, blend);
    body.setLinvel(velocity, true);

    const angular = spin.copy(body.angvel());
    if (drag.toy.kind === 'die') {
      // Rolls along the way it's being moved.
      axis.set(velocity.z, 0, -velocity.x).multiplyScalar(4);
    } else {
      // Hangs upright and leans into the motion, like something held.
      const rotation = body.rotation();
      bodyUp
        .copy(up)
        .applyQuaternion(
          temp.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
        );
      desired.set(velocity.x * 0.08, 1, velocity.z * 0.08).normalize();
      axis.crossVectors(bodyUp, desired).multiplyScalar(14);
      axis.y = angular.y * 0.9;
    }
    body.setAngvel(angular.lerp(axis, blend), true);
  }

  /** After each physics step: impacts, speed caps, lost toys, dice read-out. */
  afterStep(dt: number) {
    const now = performance.now();
    const held = this.drag?.toy;
    for (const toy of this.toys) {
      const body = toy.body;
      if (!body) continue;
      const position = body.translation();
      const isLost =
        position.y < -0.12 ||
        Math.hypot(position.x, position.z) > LOST_DISTANCE;
      toy.lostFor = isLost ? toy.lostFor + dt : 0;
      if (toy.lostFor > LOST_SECONDS || position.y < FLOOR_Y - 1) {
        this.respawn(toy);
        continue;
      }
      if (body.isSleeping() || toy === held) continue;

      const velocity = temp.velocity.copy(body.linvel());
      // Change of velocity this step beyond gravity's: a hit.
      const impact = temp.desired
        .subVectors(velocity, toy.velocityBefore)
        .setY(velocity.y - toy.velocityBefore.y - GRAVITY * dt)
        .length();
      if (
        impact > MIN_IMPACT &&
        now > this.quietUntil &&
        toy.velocityBefore.length() > 0.2 &&
        now - toy.lastHitAt > HIT_INTERVAL_MS
      ) {
        toy.lastHitAt = now;
        fx.emit({
          type: 'toy-hit',
          toy: toy.kind,
          strength: Math.min(1, (impact - MIN_IMPACT * 0.7) / 3.2),
          at: [position.x, position.y, position.z]
        });
      }
      if (velocity.length() > MAX_SPEED) {
        body.setLinvel(clampLength(velocity, MAX_SPEED), true);
      }

      if (toy.isRolling) {
        const isStill =
          velocity.length() < 0.03 &&
          temp.spin.copy(body.angvel()).length() < 0.3;
        toy.restFor = isStill ? toy.restFor + dt : 0;
        if (toy.restFor > 0.25) {
          toy.isRolling = false;
          toy.onSettle?.(faceUp(body.rotation()));
        }
      }
    }
  }
}

const ToyWorldContext = createContext<ToyWorld | null>(null);

export const ToyWorldProvider = ToyWorldContext.Provider;

/**
 * @example
 * const world = useToyWorld(); world.handlers(toy);
 */
export function useToyWorld(): ToyWorld {
  const world = useContext(ToyWorldContext);
  if (!world) throw new Error('useToyWorld must be used inside <Toys3D>');
  return world;
}
