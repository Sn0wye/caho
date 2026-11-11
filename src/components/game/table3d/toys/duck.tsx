'use client';

import { useEffect, useMemo } from 'react';
import {
  BallCollider,
  RigidBody,
  RoundCuboidCollider
} from '@react-three/rapier';
import {
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector2
} from 'three';
import type { Vec3 } from '../space';
import type { ToySpot } from './toy-spots';
import { useToy } from './use-toy';

// A rubber duck from primitives, facing local +X. Body is a lathe with a flat
// bottom so it stands; the rest are squashed spheres.
function useDuckAssets() {
  const assets = useMemo(() => {
    const profile = [
      [0, 0],
      [0.03, 0],
      [0.04, 0.004],
      [0.047, 0.013],
      [0.05, 0.025],
      [0.048, 0.036],
      [0.04, 0.047],
      [0.024, 0.055],
      [0, 0.058]
    ].map(([r, y]) => new Vector2(r, y));
    return {
      body: new LatheGeometry(profile, 40),
      sphere: new SphereGeometry(1, 32, 20),
      rubber: new MeshPhysicalMaterial({
        color: '#ffe03a',
        roughness: 0.4,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22
      }),
      wing: new MeshPhysicalMaterial({
        color: '#ffd21c',
        roughness: 0.45,
        clearcoat: 0.4
      }),
      beak: new MeshPhysicalMaterial({
        color: '#f2781e',
        roughness: 0.4,
        clearcoat: 0.5
      }),
      eye: new MeshPhysicalMaterial({
        color: '#0c0a0a',
        roughness: 0.15,
        clearcoat: 1
      }),
      glint: new MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 0.6
      })
    };
  }, []);
  useEffect(
    () => () => {
      for (const resource of Object.values(assets)) resource.dispose();
    },
    [assets]
  );
  return assets;
}

/**
 * The table's rubber duck, at `spot`, looking at the centre.
 *
 * @example
 * <Duck spot={spots.duck} />
 */
export function Duck({ spot }: { spot: ToySpot }) {
  const assets = useDuckAssets();
  const { point } = spot;
  const home: Vec3 = [point.x, 0, point.y];
  const { bodyRef, handlers } = useToy('duck', home);
  // Beak toward the centre, turned a little to show its profile.
  const yaw = Math.atan2(point.y, -point.x) + 0.7;
  const { sphere, rubber, wing, beak, eye, glint } = assets;

  const part = (
    material: MeshPhysicalMaterial | MeshStandardMaterial,
    position: Vec3,
    scale: Vec3,
    rotationZ = 0
  ) => (
    <mesh
      castShadow
      receiveShadow
      geometry={sphere}
      material={material}
      position={position}
      scale={scale}
      rotation={[0, 0, rotationZ]}
    />
  );

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={home}
      rotation={[0, yaw, 0]}
      ccd
      linearDamping={0.2}
      angularDamping={0.7}
    >
      <RoundCuboidCollider
        args={[0.042, 0.015, 0.034, 0.013]}
        position={[-0.004, 0.028, 0]}
        density={600}
        friction={0.7}
        restitution={0.3}
      />
      <BallCollider
        args={[0.032]}
        position={[0.028, 0.08, 0]}
        density={150}
        friction={0.7}
        restitution={0.3}
      />
      <group {...handlers}>
        <mesh
          castShadow
          receiveShadow
          geometry={assets.body}
          material={rubber}
          position={[-0.006, 0, 0]}
          scale={[1.2, 1, 1]}
        />
        {part(rubber, [-0.052, 0.044, 0], [0.026, 0.012, 0.022], -0.55)}
        {part(rubber, [0.028, 0.08, 0], [0.033, 0.031, 0.032])}
        {part(beak, [0.062, 0.076, 0], [0.021, 0.0072, 0.017], -0.12)}
        {part(beak, [0.057, 0.069, 0], [0.016, 0.0055, 0.013], 0.1)}
        {[1, -1].map(side => (
          <group key={side}>
            <mesh
              castShadow
              geometry={sphere}
              material={wing}
              position={[-0.012, 0.036, side * 0.043]}
              scale={[0.031, 0.014, 0.008]}
              rotation={[side * -0.35, side * 0.12, 0.3]}
            />
            {part(eye, [0.05, 0.092, side * 0.018], [0.0058, 0.0062, 0.0058])}
            {part(
              glint,
              [0.0545, 0.095, side * 0.0205],
              [0.0016, 0.0016, 0.0016]
            )}
          </group>
        ))}
      </group>
    </RigidBody>
  );
}
