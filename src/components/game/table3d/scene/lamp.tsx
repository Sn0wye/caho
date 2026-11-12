'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BackSide,
  Group,
  LatheGeometry,
  Material,
  MathUtils,
  Mesh,
  Vector2,
  Vector3
} from 'three';
import { FELT_RADIUS } from '../space';

// The bottom of the shade. The seated camera's top edge passes y ≈ 1.05 over
// the centre, and anything lower would sit on the far Players' names: keep
// it out of the seat view; it drifts in when zoomed out or orbited.
export const LAMP_Y = 1.62;
export const CEILING_Y = 2.6;
const SHADE_RADIUS = 0.27;
const SHADE_HEIGHT = 0.2;
const BULB_Y = LAMP_Y + 0.07;
const KEY_COLOR = '#ffdcb0';

// How much the shade, seen from `eye`, covers the felt: 1 when its
// silhouette lands in the middle of the table, 0 when it's off the felt or
// the eye is below it.
function lampCoverage(eye: Vector3): number {
  if (eye.y <= LAMP_Y + 0.05) return 0;
  // Where the line from the eye through the shade meets the felt.
  const t = eye.y / (eye.y - LAMP_Y);
  const reach = Math.hypot(eye.x * (1 - t), eye.z * (1 - t));
  return 1 - MathUtils.smoothstep(reach, FELT_RADIUS * 0.8, FELT_RADIUS + 0.25);
}

// Things that only glow must never catch the pointer.
const noRaycast = () => null;

function shadeProfile(): Vector2[] {
  const points: Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    // A billiard dome: steep near the top, flaring at the mouth.
    const radius = 0.05 + (SHADE_RADIUS - 0.05) * (1 - t) ** 0.55;
    points.push(new Vector2(radius, t * SHADE_HEIGHT));
  }
  return points;
}

/**
 * The pendant lamp over the table: shade, cord, glowing bulb and the warm
 * key spot with the table's shadows.
 *
 * @example
 * <Lamp />
 */
export function Lamp() {
  const shade = useMemo(() => new LatheGeometry(shadeProfile(), 48), []);
  useEffect(() => () => shade.dispose(), [shade]);

  const hardware = useRef<Group>(null);
  const fade = useRef(1);
  useFrame(({ camera }, delta) => {
    // Seen from above, the shade would sit right on the cards: fade it out
    // while its silhouette lands on the felt.
    const target = lampCoverage(camera.position) > 0.5 ? 0 : 1;
    fade.current += (target - fade.current) * Math.min(1, delta * 6);
    const group = hardware.current;
    if (!group) return;
    group.visible = fade.current > 0.02;
    group.traverse(child => {
      if (!(child instanceof Mesh)) return;
      const material = child.material as Material;
      material.transparent = fade.current < 0.999;
      material.opacity = fade.current;
    });
  });

  return (
    <group>
      <spotLight
        position={[0, BULB_Y, 0]}
        color={KEY_COLOR}
        intensity={9.5}
        // Wide and soft: full light to the felt's edge, then a pool fading
        // across the rug around the table.
        angle={0.95}
        penumbra={0.62}
        decay={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={3.8}
        // Cards lie 2 mm thick on the felt: a tiny depth bias and almost no
        // normal bias, or their shadows detach (peter-panning).
        shadow-bias={-0.00008}
        shadow-normalBias={0.0004}
        shadow-radius={3}
      />

      <group ref={hardware} position-y={LAMP_Y} raycast={noRaycast}>
        <mesh geometry={shade} raycast={noRaycast}>
          <meshStandardMaterial
            color="#16241c"
            metalness={0.55}
            roughness={0.32}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* The shade's lit underside. */}
        <mesh geometry={shade} raycast={noRaycast}>
          <meshBasicMaterial
            color={[1.6, 1.25, 0.85]}
            side={BackSide}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation-x={Math.PI / 2} raycast={noRaycast}>
          <torusGeometry args={[SHADE_RADIUS, 0.007, 8, 64]} />
          <meshStandardMaterial
            color="#c99a4e"
            metalness={1}
            roughness={0.25}
          />
        </mesh>
        <mesh position-y={0.07} raycast={noRaycast}>
          <sphereGeometry args={[0.045, 24, 16]} />
          <meshBasicMaterial color={[9, 6.4, 3.6]} toneMapped={false} />
        </mesh>
        <mesh position-y={SHADE_HEIGHT + 0.02} raycast={noRaycast}>
          <cylinderGeometry args={[0.03, 0.05, 0.05, 16]} />
          <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.3} />
        </mesh>
        <mesh
          position-y={(CEILING_Y - LAMP_Y + SHADE_HEIGHT) / 2}
          raycast={noRaycast}
        >
          <cylinderGeometry
            args={[0.004, 0.004, CEILING_Y - LAMP_Y - SHADE_HEIGHT, 6]}
          />
          <meshStandardMaterial color="#0c0b0b" roughness={0.6} />
        </mesh>
        <mesh position-y={CEILING_Y - LAMP_Y - 0.015} raycast={noRaycast}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 24]} />
          <meshStandardMaterial
            color="#c99a4e"
            metalness={1}
            roughness={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}
