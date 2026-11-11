'use client';

import { useEffect, useMemo } from 'react';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { CylinderGeometry, MeshStandardMaterial, type Material } from 'three';
import type { Vec3 } from '../space';
import type { ToySpot } from './toy-spots';
import { createChipTextures } from './toy-textures';
import { useToy } from './use-toy';

const RADIUS = 0.047;
const THICKNESS = 0.0085;

// Two stacks, bottom chip first, in the seat palette.
const STACKS = [
  ['#d1757e', '#d1757e', '#d1757e', '#66ccbe', '#66ccbe', '#c086ea'],
  ['#5c8bd6', '#5c8bd6', '#5c8bd6', '#5c8bd6', '#e5c443', '#e5c443', '#e5c443']
];

type ChipAssets = {
  geometry: CylinderGeometry;
  materials: Map<string, Material[]>;
};

function useChipAssets(): ChipAssets {
  const assets = useMemo(() => {
    const materials = new Map<string, Material[]>();
    for (const color of new Set(STACKS.flat())) {
      const { side, cap } = createChipTextures(color);
      const clay = { roughness: 0.62, metalness: 0 };
      const face = new MeshStandardMaterial({ ...clay, map: cap });
      materials.set(color, [
        new MeshStandardMaterial({ ...clay, map: side }),
        face,
        face
      ]);
    }
    return {
      geometry: new CylinderGeometry(RADIUS, RADIUS, THICKNESS, 48, 1),
      materials
    };
  }, []);
  useEffect(
    () => () => {
      assets.geometry.dispose();
      for (const [side, face] of assets.materials.values()) {
        for (const material of [side, face]) {
          if (material instanceof MeshStandardMaterial) material.map?.dispose();
          material.dispose();
        }
      }
    },
    [assets]
  );
  return assets;
}

/**
 * Two neat stacks of poker chips at `spot`.
 *
 * @example
 * <Chips spot={spots.chips} />
 */
export function Chips({ spot }: { spot: ToySpot }) {
  const assets = useChipAssets();
  const { point, tangent } = spot;
  return (
    <>
      {STACKS.map((stack, stackIndex) => {
        const side = stackIndex === 0 ? -0.056 : 0.054;
        return stack.map((color, index) => (
          <Chip
            key={`${stackIndex}-${index}`}
            color={color}
            assets={assets}
            // Golden-angle twists, so the stripes don't line up.
            twist={index * 2.4 + stackIndex}
            home={[
              point.x + tangent.x * side,
              THICKNESS * (index + 0.5) + index * 0.0002,
              point.y + tangent.y * side
            ]}
          />
        ));
      })}
    </>
  );
}

function Chip({
  color,
  assets,
  home,
  twist
}: {
  color: string;
  assets: ChipAssets;
  home: Vec3;
  twist: number;
}) {
  const { bodyRef, handlers } = useToy('chip', home);
  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={home}
      rotation={[0, twist, 0]}
      ccd
      linearDamping={0.25}
      angularDamping={0.9}
      additionalSolverIterations={4}
    >
      <CylinderCollider
        args={[THICKNESS / 2, RADIUS]}
        density={1500}
        friction={0.5}
        restitution={0.06}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={assets.geometry}
        material={assets.materials.get(color)}
        {...handlers}
      />
    </RigidBody>
  );
}
