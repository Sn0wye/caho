'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CAMERA_FOV } from '../space';
import { useTable3D } from '../store';
import { useSeats, useStage } from '../use-table';
import {
  bake,
  CHANNELS,
  clamp,
  makeRig,
  MAX_POLAR,
  MIN_POLAR,
  seatPose,
  smooth,
  stageOffsets,
  topPose,
  unwrap,
  type Rig
} from './rig';
import { useCameraControls } from './use-camera-controls';

const INTRO_SECONDS = 2.5;
const SPIN_SPEED = 0.12;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * The camera: an orbit state eased toward a goal every frame. Seat and top
 * views, right-drag orbit, wheel dolly, a swooping intro and stage moves.
 *
 * @example
 * <Canvas><CameraRig /></Canvas>
 */
export default function CameraRig() {
  const camera = useThree(state => state.camera);
  const { self, seats } = useSeats();
  const stage = useStage();

  // What the frame loop reads; written every render, never read by React.
  const world = useRef({
    direction: { x: 0, y: 1 },
    winner: null as { x: number; y: number } | null,
    kind: stage.kind
  });
  world.current.direction = self?.direction ?? { x: 0, y: 1 };
  world.current.kind = stage.kind;
  const winnerId = stage.kind === 'result' ? stage.result.winnerId : null;
  world.current.winner =
    seats.find(seat => seat.player.id === winnerId)?.direction ?? null;

  const rigRef = useRef<Rig | null>(null);
  const flags = useRef({ isReduced: false });
  if (!rigRef.current && typeof window !== 'undefined') {
    const query = new URLSearchParams(window.location.search);
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    flags.current.isReduced = isReduced;
    rigRef.current = makeRig(query.get('nointro') !== '1' && !isReduced);
  }

  useCameraControls(rigRef);

  useEffect(() => {
    if ('fov' in camera && camera.fov !== CAMERA_FOV) {
      (camera as { fov: number }).fov = CAMERA_FOV;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Before everything else renders or reads the camera.
  useFrame((state, rawDelta) => {
    const rig = rigRef.current;
    if (!rig) return;
    const delta = Math.min(rawDelta, 0.05);
    const { direction, kind, winner } = world.current;
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const { cameraView: view } = useTable3D.getState();
    const isReduced = flags.current.isReduced;

    if (!rig.isReady) {
      seatPose(rig.goal, direction, aspect);
      for (const key of CHANNELS) {
        rig.core[key].v = rig.goal[key];
        rig.out[key] = rig.goal[key];
      }
      rig.weight.v = 1;
      rig.isReady = true;
    }

    // Left the seat view (HUD button, key): carry on from where we are.
    if (view !== rig.view) {
      if (rig.view === 'seat') bake(rig);
      rig.view = view;
    }

    if (view === 'seat') seatPose(rig.goal, direction, aspect);
    else if (view === 'top') topPose(rig.goal, direction, aspect);
    if (view !== 'free') {
      rig.goal.az = unwrap(rig.goal.az, rig.core.az.v);
    }

    // Glide for views, stay close to the hand while orbiting freely.
    const glide = view === 'free' ? 0.14 : 0.6;
    for (const key of CHANNELS) {
      smooth(rig.core[key], rig.goal[key], glide, delta);
    }

    // Stage moves, only layered on while seated.
    const isSeat = view === 'seat';
    stageOffsets(rig.offsetGoal, kind, direction, winner);
    if (kind === 'finished' && isSeat && !isReduced)
      rig.spin += delta * SPIN_SPEED;
    else rig.spin = 0;
    rig.offsetGoal.az = rig.spin;
    for (const key of CHANNELS) {
      smooth(rig.offsets[key], rig.offsetGoal[key], 1.4, delta);
    }
    if (rig.spin === 0) {
      const az = rig.offsets.az;
      az.v = unwrap(az.v, 0);
    }
    const weight = smooth(rig.weight, isSeat ? 1 : 0, 0.7, delta);

    // The seated camera holds still: no pointer parallax, sway or shake.
    // Anything that moves the whole frame reads as a tremor.
    const { core, offsets, out } = rig;
    out.x = core.x.v + weight * offsets.x.v;
    out.y = core.y.v + weight * offsets.y.v;
    out.z = core.z.v + weight * offsets.z.v;
    out.az = core.az.v + weight * offsets.az.v;
    out.pol = core.pol.v + weight * offsets.pol.v;
    out.dist = core.dist.v + weight * offsets.dist.v;

    // Intro: start high and wide, orbiting, swoop into the seat.
    if (!rig.isIntroSkipped) {
      rig.introTime += delta;
      rig.intro.v = 1 - easeInOut(clamp(rig.introTime / INTRO_SECONDS, 0, 1));
      rig.intro.vel = 0;
      if (rig.introTime >= INTRO_SECONDS) rig.isIntroSkipped = true;
    } else {
      smooth(rig.intro, 0, 0.35, delta);
    }
    const intro = rig.intro.v;

    const az = out.az + intro * 1.6;
    const pol = clamp(out.pol - intro * 0.6, MIN_POLAR, MAX_POLAR);
    const dist = out.dist + intro * 1.5;
    const horizontal = dist * Math.sin(pol);
    camera.position.set(
      out.x + horizontal * Math.sin(az),
      Math.max(out.y + dist * Math.cos(pol), 0.14),
      out.z + horizontal * Math.cos(az)
    );
    camera.lookAt(out.x, out.y, out.z);
    camera.updateMatrixWorld();
  }, -1);

  return null;
}
