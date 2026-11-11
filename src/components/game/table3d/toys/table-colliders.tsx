'use client';

import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  FELT_RADIUS,
  FLOOR_Y,
  RIM_HEIGHT,
  TABLE_RADIUS,
  TABLE_THICKNESS
} from '../space';

// The table top as overlapping radial boxes: boxes give Rapier its steadiest
// flat contacts (a cylinder or hull top let resting chip stacks drift or sink).
const TOP_SEGMENTS = 24;
const TOP_HALF_WIDTH = TABLE_RADIUS * Math.tan(Math.PI / TOP_SEGMENTS);

const RIM_SEGMENTS = 48;
const RIM_WIDTH = TABLE_RADIUS - FELT_RADIUS;
const RIM_MIDDLE = (TABLE_RADIUS + FELT_RADIUS) / 2;
// Overlap the segments a little so nothing slips between them.
const RIM_HALF_LENGTH = ((RIM_MIDDLE * Math.PI) / RIM_SEGMENTS) * 1.1;

/**
 * The invisible world the toys bump into: table top (felt), the padded rim
 * bumper and the floor. The environment layer draws them.
 *
 * @example
 * <TableColliders />
 */
export function TableColliders() {
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Felt: grippy and dead, so dice tumble and settle and chips stop. */}
      {Array.from({ length: TOP_SEGMENTS }, (_, index) => {
        const angle = (index / TOP_SEGMENTS) * Math.PI * 2;
        return (
          <CuboidCollider
            key={index}
            args={[TABLE_RADIUS / 2, TABLE_THICKNESS / 2, TOP_HALF_WIDTH]}
            position={[
              (Math.cos(angle) * TABLE_RADIUS) / 2,
              -TABLE_THICKNESS / 2,
              (Math.sin(angle) * TABLE_RADIUS) / 2
            ]}
            rotation={[0, -angle, 0]}
            friction={0.9}
            restitution={0.15}
          />
        );
      })}
      {/* Padded leather: a bouncier, slicker bumper. */}
      {Array.from({ length: RIM_SEGMENTS }, (_, index) => {
        const angle = (index / RIM_SEGMENTS) * Math.PI * 2;
        return (
          <CuboidCollider
            key={index}
            args={[RIM_WIDTH / 2, RIM_HEIGHT / 2, RIM_HALF_LENGTH]}
            position={[
              Math.cos(angle) * RIM_MIDDLE,
              RIM_HEIGHT / 2,
              Math.sin(angle) * RIM_MIDDLE
            ]}
            rotation={[0, -angle, 0]}
            friction={0.5}
            restitution={0.55}
          />
        );
      })}
      <CuboidCollider
        args={[10, 0.2, 10]}
        position={[0, FLOOR_Y - 0.2, 0]}
        friction={0.8}
        restitution={0.25}
      />
    </RigidBody>
  );
}
