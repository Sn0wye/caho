'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RoundCuboidCollider } from '@react-three/rapier';
import { MeshPhysicalMaterial, type Sprite, type Texture } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Vec3 } from '../space';
import type { ToySpot } from './toy-spots';
import { createDieLabels, createDieTextures } from './toy-textures';
import { useToy } from './use-toy';

const SIZE = 0.066;
const BEVEL = 0.0085;
// How long a rolled value stays up, seconds.
const LABEL_SECONDS = 1.9;

type DieAssets = {
  geometry: RoundedBoxGeometry;
  materials: MeshPhysicalMaterial[];
  labels: Texture[];
};

function useDieAssets(): DieAssets {
  const assets = useMemo(() => {
    const { maps, bumps } = createDieTextures();
    return {
      geometry: new RoundedBoxGeometry(SIZE, SIZE, SIZE, 4, BEVEL),
      materials: maps.map(
        (map, index) =>
          new MeshPhysicalMaterial({
            map,
            bumpMap: bumps[index],
            bumpScale: 1.2,
            roughness: 0.32,
            clearcoat: 0.7,
            clearcoatRoughness: 0.18
          })
      ),
      labels: createDieLabels()
    };
  }, []);
  useEffect(
    () => () => {
      assets.geometry.dispose();
      for (const material of assets.materials) {
        material.map?.dispose();
        material.bumpMap?.dispose();
        material.dispose();
      }
      for (const label of assets.labels) label.dispose();
    },
    [assets]
  );
  return assets;
}

/**
 * Two ivory dice resting side by side at `spot`.
 *
 * @example
 * <Dice spot={spots.dice} />
 */
export function Dice({ spot }: { spot: ToySpot }) {
  const assets = useDieAssets();
  const { point, tangent } = spot;
  const at = (side: number): Vec3 => [
    point.x + tangent.x * side,
    SIZE / 2,
    point.y + tangent.y * side
  ];
  return (
    <>
      <Die assets={assets} home={at(-0.05)} rotation={[0, 0.4, 0]} />
      <Die assets={assets} home={at(0.055)} rotation={[Math.PI / 2, -0.3, 0]} />
    </>
  );
}

function Die({
  assets,
  home,
  rotation
}: {
  assets: DieAssets;
  home: Vec3;
  rotation: Vec3;
}) {
  const { toy, bodyRef, handlers } = useToy('die', home);
  const label = useRef<Sprite>(null);
  const shownFor = useRef(Infinity);

  useEffect(() => {
    toy.onSettle = value => {
      const sprite = label.current;
      if (!sprite) return;
      sprite.material.map = assets.labels[value - 1];
      sprite.material.needsUpdate = true;
      shownFor.current = 0;
    };
    return () => {
      toy.onSettle = undefined;
    };
  }, [toy, assets]);

  useFrame((_, delta) => {
    const sprite = label.current;
    if (!sprite) return;
    if (toy.isRolling || shownFor.current >= LABEL_SECONDS) {
      sprite.visible = false;
      shownFor.current = Infinity;
      return;
    }
    shownFor.current += delta;
    const t = shownFor.current;
    const body = toy.body;
    if (!body) return;
    const position = body.translation();
    // Pops up with a little overshoot, floats, fades.
    const pop = Math.min(t / 0.22, 1);
    const overshoot = 1 + Math.sin(pop * Math.PI) * 0.18;
    sprite.visible = true;
    sprite.position.set(
      position.x,
      position.y + SIZE * 0.9 + pop * 0.03 + t * 0.008,
      position.z
    );
    sprite.scale.setScalar(0.085 * pop * overshoot);
    sprite.material.opacity = Math.min(1, (LABEL_SECONDS - t) / 0.5);
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        colliders={false}
        position={home}
        rotation={rotation}
        ccd
        linearDamping={0.15}
        angularDamping={0.45}
      >
        <RoundCuboidCollider
          args={[SIZE / 2 - BEVEL, SIZE / 2 - BEVEL, SIZE / 2 - BEVEL, BEVEL]}
          density={1000}
          friction={0.55}
          restitution={0.38}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={assets.geometry}
          material={assets.materials}
          {...handlers}
        />
      </RigidBody>
      <sprite ref={label} visible={false} renderOrder={20}>
        <spriteMaterial transparent depthTest={false} depthWrite={false} />
      </sprite>
    </>
  );
}
