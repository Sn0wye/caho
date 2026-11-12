'use client';

import { useLayoutEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import {
  CircleGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  type Texture,
  type ToneMapping
} from 'three';
import { EnvMapContext } from './env-map';
import { Lamp, LAMP_Y } from './lamp';
import { BAR_AMBER, NEON_PINK, NEON_TEAL, Room, ROOM_HALF } from './room';
import { Table } from './table';

const BACKGROUND = '#07060a';
const HAZE = '#0b0910';
// What glossy objects from other layers get from the room's reflections.
const SHARED_ENV_INTENSITY = 0.6;

// Neutral (Khronos PBR) tone mapping leaves everything below ~0.8 untouched,
// so white cards stay white instead of ACES-grey; the post layer uses the
// same curve when it takes over.
function RendererSetup() {
  const gl = useThree(state => state.gl);
  useLayoutEffect(() => {
    const previous: {
      toneMapping: ToneMapping;
      exposure: number;
      shadowType: typeof gl.shadowMap.type;
    } = {
      toneMapping: gl.toneMapping,
      exposure: gl.toneMappingExposure,
      shadowType: gl.shadowMap.type
    };
    gl.toneMapping = NeutralToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = SRGBColorSpace;
    gl.shadowMap.enabled = true;
    // Three folded soft PCF into PCF + shadow.radius.
    gl.shadowMap.type = PCFShadowMap;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.toneMapping = previous.toneMapping;
      gl.toneMappingExposure = previous.exposure;
      gl.shadowMap.type = previous.shadowType;
    };
  }, [gl]);
  return null;
}

type Panel = {
  color: string;
  intensity: number;
  position: [number, number, number];
  size: [number, number];
  isRound?: boolean;
};

// Glowing shapes standing in for the room's lights, as the reflections see
// them: the lamp above, a warm ceiling bounce, the neon, the bar, faint warm
// side panels so silhouettes keep an edge from every side. The neon is kept
// small and dim here: the map also feeds every glossy prop's diffuse light,
// and a bright pink panel turned white cards and seat colours magenta.
const PANELS: Panel[] = [
  {
    color: '#ffd3a0',
    intensity: 2.6,
    position: [0, LAMP_Y + 0.4, 0],
    size: [1.4, 1.4],
    isRound: true
  },
  {
    color: '#ffe2c4',
    intensity: 0.35,
    position: [0, LAMP_Y + 0.9, 0],
    size: [7, 7],
    isRound: true
  },
  {
    color: NEON_PINK,
    intensity: 0.9,
    position: [0, 0.15, -ROOM_HALF],
    size: [2.4, 0.7]
  },
  {
    color: BAR_AMBER,
    intensity: 2.2,
    position: [0, 0.7, ROOM_HALF],
    size: [2.4, 1.4]
  },
  {
    color: NEON_TEAL,
    intensity: 0.8,
    position: [1.9, 0.9, ROOM_HALF - 0.05],
    size: [0.7, 0.7]
  },
  {
    color: '#ffcf9a',
    intensity: 0.8,
    position: [ROOM_HALF, 0.6, -1.3],
    size: [1, 1.2]
  },
  {
    color: '#ffcf9a',
    intensity: 0.8,
    position: [-ROOM_HALF, 0.6, 0],
    size: [2.2, 1.2]
  }
];

// Reflections: brass, leather, glass and the glossy pawns pick up the lamp,
// the neon and the bar from an environment map prefiltered once from PANELS.
// Built by hand (drei's <Environment> cube camera breaks on this three
// version, and a one-off PMREM is cheaper anyway).
function useReflections(): Texture | null {
  const gl = useThree(state => state.gl);
  const scene = useThree(state => state.scene);
  const [envMap, setEnvMap] = useState<Texture | null>(null);
  useLayoutEffect(() => {
    const room = new Scene();
    room.background = new Color('#050407');
    const geometries = [new PlaneGeometry(1, 1), new CircleGeometry(0.5, 32)];
    const materials: MeshBasicMaterial[] = [];
    for (const panel of PANELS) {
      const material = new MeshBasicMaterial({
        color: new Color(panel.color).multiplyScalar(panel.intensity),
        side: DoubleSide
      });
      materials.push(material);
      const mesh = new Mesh(geometries[panel.isRound ? 1 : 0], material);
      mesh.position.set(...panel.position);
      mesh.scale.set(panel.size[0], panel.size[1], 1);
      mesh.lookAt(0, panel.isRound ? 0 : panel.position[1], 0);
      room.add(mesh);
    }
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, 0, 0.1, 20);
    generator.dispose();
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();

    // Other layers' materials (pawns, cards, toys) inherit it from the scene.
    const previous = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    scene.environment = target.texture;
    scene.environmentIntensity = SHARED_ENV_INTENSITY;
    setEnvMap(target.texture);
    return () => {
      scene.environment = previous;
      scene.environmentIntensity = previousIntensity;
      target.dispose();
    };
  }, [gl, scene]);
  return envMap;
}

/**
 * The after-hours back room: renderer state, every light, reflections, the
 * table, the pendant lamp and the room around them.
 *
 * @example
 * <Canvas shadows><Environment3D /></Canvas>
 */
export default function Environment3D() {
  const envMap = useReflections();
  return (
    <EnvMapContext value={envMap}>
      <RendererSetup />
      <color attach="background" args={[BACKGROUND]} />
      <fogExp2 attach="fog" args={[HAZE, 0.025]} />

      {/* Warm-neutral fill: lifts the panelling, floor and props out of
          the black without tinting what sits on the table. */}
      <hemisphereLight args={['#5a4a46', '#1c1412', 1.9]} />
      {/* The lamp's light bounced off the felt and the players: the only
          thing that reaches the backs of held cards and the pawns' fronts,
          which face the centre and away from the spot. */}
      <pointLight
        position={[0, 0.95, 0]}
        color="#ffd9b0"
        intensity={0.55}
        distance={3.2}
        decay={1.6}
      />

      <Lamp />
      <Table />
      <Room />
    </EnvMapContext>
  );
}
