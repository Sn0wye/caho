'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import type { Vec3 } from '../space';
import { useToyWorld, type ToyKind } from './toy-world';

/**
 * Registers one toy with the toy world: its body ref, its pointer handlers,
 * and its home (an untouched toy drops onto a new home when seats change).
 *
 * @example
 * const { toy, bodyRef, handlers } = useToy('die', [0.5, 0.035, 0.6]);
 */
export function useToy(kind: ToyKind, home: Vec3) {
  const world = useToyWorld();
  const [toy] = useState(() => world.create(kind, home));
  useEffect(() => world.register(toy), [world, toy]);

  const [x, y, z] = home;
  useEffect(() => {
    const [oldX, , oldZ] = toy.home;
    toy.home = [x, y, z];
    if (!toy.isTouched && Math.hypot(x - oldX, z - oldZ) > 0.05) {
      world.respawn(toy);
    }
  }, [world, toy, x, y, z]);

  const bodyRef = useCallback(
    (body: RapierRigidBody | null) => {
      toy.body = body;
    },
    [toy]
  );
  const handlers = useMemo(() => world.handlers(toy), [world, toy]);
  return { toy, bodyRef, handlers };
}
