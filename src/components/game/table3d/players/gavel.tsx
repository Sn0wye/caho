'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { seatPoint, tableToWorld, type Seat3D } from '../space';
import { fx } from '../store';

// The Judge holds no cards: they get the gavel. It rests on its block on the
// felt in front of them and bangs twice when the Round is decided.

const BLOCK_HEIGHT = 0.024;
const HEAD_LENGTH = 0.085;
// Where the handle's end rests and where the block sits, from the Judge's
// seat: [distance from the centre, to their right].
const PIVOT_SPOT = [0.8, 0.2] as const;
const BLOCK_SPOT = [0.73, 0.02] as const;
// One strike: wind up, come down, a small rebound.
const RAISE = 0.85;
const STRIKE_SECONDS = 0.34;
const STRIKES = 2;
const noRaycast = () => null;

type GavelProps = {
  // The Judge's seat (this Player's too), or null when nobody judges.
  seat: Seat3D | null;
};

/**
 * @example
 * <Gavel seat={seats.find(seat => seat.player.id === judgeId) ?? null} />
 */
export function Gavel({ seat }: GavelProps) {
  const root = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const sim = useRef({ shown: 0, bangAt: -1, time: 0, struck: 0 });

  const layout = useMemo(() => {
    if (!seat) return null;
    const pivot = tableToWorld(seatPoint(seat, ...PIVOT_SPOT));
    const block = tableToWorld(seatPoint(seat, ...BLOCK_SPOT));
    const dx = block[0] - pivot[0];
    const dz = block[2] - pivot[2];
    const length = Math.hypot(dx, dz);
    return {
      pivot,
      block,
      length,
      // Turns the arm's local +X from the pivot toward the block.
      yaw: Math.atan2(-dz, dx),
      // The head stands on the block: the handle slopes up to it.
      rest: Math.asin((BLOCK_HEIGHT + HEAD_LENGTH / 2) / length)
    };
  }, [seat]);
  const layoutRef = useRef(layout);
  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(
    () =>
      fx.on(event => {
        if (event.type !== 'round-won') return;
        sim.current.bangAt = sim.current.time;
        sim.current.struck = 0;
      }),
    []
  );

  useFrame((_, delta) => {
    const s = sim.current;
    const now = layoutRef.current;
    if (!root.current || !arm.current) return;
    const dt = Math.min(delta, 1 / 30);
    s.time += dt;
    s.shown += ((now ? 1 : 0) - s.shown) * Math.min(1, dt * 10);
    root.current.visible = s.shown > 0.01;
    if (!now || !root.current.visible) return;
    root.current.scale.setScalar(s.shown);

    let lift = 0;
    const since = s.bangAt < 0 ? -1 : s.time - s.bangAt;
    if (since >= 0 && since < STRIKE_SECONDS * STRIKES) {
      const strike = Math.floor(since / STRIKE_SECONDS);
      const t = (since % STRIKE_SECONDS) / STRIKE_SECONDS;
      // Up for the first 60%, down hard, then rest on the block.
      lift = t < 0.6 ? Math.sin((t / 0.6) * (Math.PI / 2)) : 0;
      if (t >= 0.6 && t < 0.78) lift = 1 - ((t - 0.6) / 0.18) ** 2;
      if (t >= 0.78 && s.struck === strike) {
        s.struck = strike + 1;
        // The sound layer plays this as a hard wooden knock.
        fx.emit({ type: 'toy-hit', toy: 'die', strength: 1, at: now.block });
      }
    }
    arm.current.rotation.z = now.rest + lift * RAISE;
  });

  return (
    <group ref={root} visible={false}>
      {layout && (
        <>
          <mesh
            position={[layout.block[0], BLOCK_HEIGHT / 2, layout.block[2]]}
            castShadow
            receiveShadow
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.062, 0.068, BLOCK_HEIGHT, 32]} />
            <meshStandardMaterial color="#4a2a17" roughness={0.45} />
          </mesh>
          <group
            position={[layout.pivot[0], 0.01, layout.pivot[2]]}
            rotation-y={layout.yaw}
          >
            <group ref={arm} rotation-z={layout.rest}>
              <mesh
                position={[layout.length / 2, 0, 0]}
                rotation-z={Math.PI / 2}
                castShadow
                raycast={noRaycast}
              >
                <cylinderGeometry args={[0.008, 0.011, layout.length, 12]} />
                <meshStandardMaterial color="#5a3420" roughness={0.5} />
              </mesh>
              <group position={[layout.length, 0, 0]}>
                <mesh castShadow raycast={noRaycast}>
                  <cylinderGeometry args={[0.03, 0.03, HEAD_LENGTH, 24]} />
                  <meshStandardMaterial color="#5a3420" roughness={0.42} />
                </mesh>
                {[-1, 1].map(side => (
                  <mesh
                    key={side}
                    position={[0, side * HEAD_LENGTH * 0.34, 0]}
                    raycast={noRaycast}
                  >
                    <cylinderGeometry args={[0.0315, 0.0315, 0.01, 24]} />
                    <meshStandardMaterial
                      color="#c9a24a"
                      metalness={0.9}
                      roughness={0.3}
                    />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </>
      )}
    </group>
  );
}
