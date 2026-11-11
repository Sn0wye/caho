'use client';

import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { Mesh } from 'three';
import { CARD_THICKNESS } from '../space';
import { getCardGeometry, getGlowGeometry } from './geometry';
import type { CardWorld } from './world';

type CardMeshProps = { world: CardWorld; id: string };

/**
 * One card's mesh. The world writes its matrix and materials every frame;
 * React only mounts and unmounts it.
 *
 * @example
 * <CardMesh world={world} id="black:3" />
 */
export function CardMesh({ world, id }: CardMeshProps) {
  const ref = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const camera = useThree(state => state.camera);

  useLayoutEffect(() => {
    const mesh = ref.current;
    const entity = world.entities.get(id);
    if (!mesh || !entity) return;
    entity.mesh = mesh;
    entity.glowMesh = glowRef.current;
    mesh.userData.cardId = id;
    // A Hand card rides the camera: re-resolve it against the camera as it
    // is at render time, whichever layer moved it last this frame.
    mesh.onBeforeRender = () => {
      if (entity.space === 'camera') {
        mesh.matrixWorld.copy(entity.resolve(camera));
      }
    };
    return () => world.detach(entity);
  }, [world, id, camera]);

  const entityOf = () => world.entities.get(id);

  return (
    <mesh
      ref={ref}
      geometry={getCardGeometry()}
      matrixAutoUpdate={false}
      frustumCulled={false}
      visible={false}
      castShadow
      receiveShadow
      onPointerOver={event => {
        const entity = entityOf();
        if (entity) world.pointerMove(entity, event);
      }}
      onPointerMove={event => {
        const entity = entityOf();
        if (entity) world.pointerMove(entity, event);
      }}
      onPointerOut={() => {
        const entity = entityOf();
        if (entity) world.pointerOut(entity);
      }}
      onClick={event => {
        const entity = entityOf();
        if (entity) world.click(entity, event);
      }}
    >
      <mesh
        ref={glowRef}
        geometry={getGlowGeometry()}
        position={[0, 0, -CARD_THICKNESS * 1.5]}
        visible={false}
        renderOrder={-1}
        raycast={() => undefined}
      />
    </mesh>
  );
}
