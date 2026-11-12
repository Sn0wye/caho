'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  LatheGeometry,
  Matrix4,
  Object3D,
  Quaternion,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
  type InstancedMesh
} from 'three';
import { FLOOR_Y } from '../space';
import { useEnvMap } from './env-map';
import { CEILING_Y } from './lamp';
import { adultsOnlyStrokes, cahoStrokes, NeonTubes } from './neon';
import {
  chalkboardTexture,
  dartboardTexture,
  exitTexture,
  floorTexture,
  glowTexture,
  jukeboxTexture,
  posterTexture,
  rugTexture,
  seeded,
  taglineTexture,
  wallTexture,
  walnutTexture
} from './textures';

// The back room, mostly implied: walls ROOM_HALF from the centre, lost in
// shadow, each side with something to look at so no seat faces a void.
export const ROOM_HALF = 4.8;
const WALL_HEIGHT = CEILING_Y - FLOOR_Y;
// Wainscot top at y ≈ 0.15, just above the table top.
const WAINSCOT = 0.28;
const WALL_TILE = 1.7;
const FLOOR_TILE = 1.6;
const RUG_RADIUS = 1.95;

export const NEON_PINK = '#ff2f9e';
export const NEON_PURPLE = '#a64dff';
export const NEON_TEAL = '#21e0cf';
export const BAR_AMBER = '#ffad55';
// Nothing blooms: tubes sit just over 1 so they clip to a hot, saturated
// colour instead of white.
const NEON_LEVEL = 2;
const LAMP_WARM = '#ffb46a';
const WALL_TINT = new Color(1.7, 1.6, 1.7);

// The seated camera sees a band of far wall between the far Players' heads
// and the top of the frame, ≈ y −0.4…0.5: every wall keeps its accent there.
const SIGN_Y = 0.12;
const SIGN_SCALE = 0.56;

const CAHO = cahoStrokes();
const CAHO_STEADY = CAHO.filter((_, index) => index !== 2).flat();
const CAHO_FLICKER = CAHO[2];
const ADULTS = adultsOnlyStrokes();

const noRaycast = () => null;

function Walls() {
  const envMap = useEnvMap();
  const texture = useMemo(() => {
    const wall = wallTexture(WAINSCOT).clone();
    wall.repeat.set((ROOM_HALF * 2) / WALL_TILE, 1);
    wall.needsUpdate = true;
    return wall;
  }, []);
  const walls: { position: [number, number, number]; yaw: number }[] = [
    { position: [0, 0, -ROOM_HALF], yaw: 0 },
    { position: [0, 0, ROOM_HALF], yaw: Math.PI },
    { position: [ROOM_HALF, 0, 0], yaw: -Math.PI / 2 },
    { position: [-ROOM_HALF, 0, 0], yaw: Math.PI / 2 }
  ];
  return (
    <group raycast={noRaycast}>
      {walls.map(({ position, yaw }) => (
        <mesh
          key={yaw}
          position={[position[0], FLOOR_Y + WALL_HEIGHT / 2, position[2]]}
          rotation-y={yaw}
          receiveShadow
          raycast={noRaycast}
        >
          <planeGeometry args={[ROOM_HALF * 2, WALL_HEIGHT]} />
          <meshStandardMaterial
            map={texture}
            // Over 1: the wallpaper is painted dark and the room has few
            // lights, so the walls carry their own brightness.
            color={WALL_TINT}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={0.3}
            roughness={0.85}
            envMap={envMap}
            envMapIntensity={0.08}
          />
        </mesh>
      ))}
      <mesh position-y={CEILING_Y} rotation-x={Math.PI / 2} raycast={noRaycast}>
        <planeGeometry args={[ROOM_HALF * 2, ROOM_HALF * 2]} />
        <meshStandardMaterial color="#0b090c" roughness={1} />
      </mesh>
    </group>
  );
}

function Floor() {
  const envMap = useEnvMap();
  const textures = useMemo(() => {
    const floor = floorTexture();
    floor.repeat.set(
      (ROOM_HALF * 2) / FLOOR_TILE,
      (ROOM_HALF * 2) / FLOOR_TILE
    );
    return { floor, rug: rugTexture() };
  }, []);
  return (
    <group raycast={noRaycast}>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={FLOOR_Y}
        receiveShadow
        raycast={noRaycast}
      >
        <planeGeometry args={[ROOM_HALF * 2, ROOM_HALF * 2]} />
        <meshStandardMaterial
          map={textures.floor}
          emissiveMap={textures.floor}
          emissive="#ffffff"
          emissiveIntensity={0.14}
          roughness={0.42}
          envMap={envMap}
          envMapIntensity={0.15}
        />
      </mesh>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={FLOOR_Y + 0.008}
        receiveShadow
        raycast={noRaycast}
      >
        <circleGeometry args={[RUG_RADIUS, 96]} />
        <meshStandardMaterial
          map={textures.rug}
          roughness={1}
          envMap={envMap}
          envMapIntensity={0.05}
        />
      </mesh>
      <mesh position-y={FLOOR_Y + 0.004} raycast={noRaycast}>
        <cylinderGeometry
          args={[RUG_RADIUS, RUG_RADIUS + 0.004, 0.008, 96, 1, true]}
        />
        <meshStandardMaterial color="#1a0913" roughness={1} />
      </mesh>
    </group>
  );
}

type GlowProps = {
  position: [number, number, number];
  yaw?: number;
  size: [number, number];
  color: string;
  strength: number;
};

// Light spilling onto a wall, faked with an additive decal.
function WallGlow({ position, yaw = 0, size, color, strength }: GlowProps) {
  const tint = useMemo(
    () => new Color(color).multiplyScalar(strength),
    [color, strength]
  );
  return (
    <mesh position={position} rotation-y={yaw} raycast={noRaycast}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={glowTexture()}
        color={tint}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function bottleProfile(kind: 'wine' | 'squat'): Vector2[] {
  const points =
    kind === 'wine'
      ? [
          [0, 0],
          [0.036, 0],
          [0.038, 0.01],
          [0.038, 0.19],
          [0.03, 0.23],
          [0.014, 0.26],
          [0.013, 0.32],
          [0.016, 0.325],
          [0, 0.33]
        ]
      : [
          [0, 0],
          [0.05, 0],
          [0.052, 0.01],
          [0.052, 0.13],
          [0.04, 0.16],
          [0.016, 0.175],
          [0.015, 0.215],
          [0.019, 0.22],
          [0, 0.225]
        ];
  return points.map(([x, y]) => new Vector2(x, y));
}

const GLASS_COLORS = [
  '#8a4212',
  '#1f6a30',
  '#dfe8e4',
  '#8a1830',
  '#b07a1c',
  '#2a5a8a'
];
const BOTTLE_KINDS = ['wine', 'squat'] as const;
type BottleKind = (typeof BOTTLE_KINDS)[number];

let bottleGeometries: Record<BottleKind, LatheGeometry> | undefined;

// Shared by every row for the page's lifetime, like the textures.
function bottleGeometry(kind: BottleKind): LatheGeometry {
  bottleGeometries ??= {
    wine: new LatheGeometry(bottleProfile('wine'), 12),
    squat: new LatheGeometry(bottleProfile('squat'), 12)
  };
  return bottleGeometries[kind];
}

type BottlesProps = {
  count: number;
  width: number;
  seed: number;
  position: [number, number, number];
};

// A row of bottles: glossy coloured glass, one draw call per shape.
function Bottles({ count, width, seed, position }: BottlesProps) {
  const envMap = useEnvMap();
  const wine = useRef<InstancedMesh>(null);
  const squat = useRef<InstancedMesh>(null);
  const bottles = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => ({
      x: -width / 2 + ((index + 0.3 + random() * 0.4) / count) * width,
      z: (random() - 0.5) * 0.08,
      kind: random() > 0.45 ? BOTTLE_KINDS[0] : BOTTLE_KINDS[1],
      scale: 0.85 + random() * 0.3,
      color: GLASS_COLORS[Math.floor(random() * GLASS_COLORS.length)]
    }));
  }, [count, width, seed]);

  useLayoutEffect(() => {
    const dummy = new Object3D();
    const color = new Color();
    for (const [kind, ref] of [
      ['wine', wine],
      ['squat', squat]
    ] as const) {
      const mesh = ref.current;
      if (!mesh) continue;
      let index = 0;
      for (const bottle of bottles) {
        if (bottle.kind !== kind) continue;
        dummy.position.set(bottle.x, 0, bottle.z);
        dummy.scale.setScalar(bottle.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, color.set(bottle.color));
        index++;
      }
      mesh.count = index;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [bottles]);

  return (
    <group position={position}>
      {BOTTLE_KINDS.map(kind => (
        <instancedMesh
          key={kind}
          ref={kind === 'wine' ? wine : squat}
          args={[bottleGeometry(kind), undefined, count]}
          // Instances spread far past the one bottle the bounds describe.
          frustumCulled={false}
          raycast={noRaycast}
        >
          <meshStandardMaterial
            roughness={0.08}
            metalness={0.1}
            envMap={envMap}
            envMapIntensity={2}
          />
        </instancedMesh>
      ))}
    </group>
  );
}

function Walnut({
  position,
  size,
  color = '#8a644c'
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  const envMap = useEnvMap();
  return (
    <mesh position={position} raycast={noRaycast}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={walnutTexture()}
        color={color}
        // Furniture stands where no light reaches: it glows a little.
        emissiveMap={walnutTexture()}
        emissive="#ffffff"
        emissiveIntensity={0.3}
        roughness={0.45}
        envMap={envMap}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

// North wall: the CAHO sign over a low credenza.
function NeonWall() {
  const wall = -ROOM_HALF;
  return (
    <group>
      <group position={[0, SIGN_Y, wall + 0.06]}>
        <NeonTubes
          strokes={CAHO_STEADY}
          scale={SIGN_SCALE}
          color={NEON_PINK}
          intensity={NEON_LEVEL}
          radius={0.016}
        />
        <NeonTubes
          strokes={CAHO_FLICKER}
          scale={SIGN_SCALE}
          color={NEON_PINK}
          intensity={NEON_LEVEL}
          radius={0.016}
        />
        <mesh position={[0.05, -0.4, 0]} raycast={noRaycast}>
          <planeGeometry args={[2.3, 0.29]} />
          <meshBasicMaterial
            map={taglineTexture()}
            color={new Color(NEON_PURPLE).multiplyScalar(1.8)}
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
      <WallGlow
        position={[0, SIGN_Y - 0.1, wall + 0.02]}
        size={[4.2, 2.2]}
        color={NEON_PINK}
        strength={0.16}
      />
      {/* Lights the wall and floor by the sign and dies out well before the
          table, where the warm lamp must own the colours. */}
      <pointLight
        position={[0, 0.3, wall + 0.6]}
        color={NEON_PINK}
        intensity={3.5}
        distance={2.6}
        decay={1.5}
      />

      <Dartboard position={[2.6, 0.16, wall + 0.02]} />
      <Sconce position={[-3.9, 0.12, wall]} />

      {/* A sideboard off to one side, so the sign's floor glow stays clear
          behind the table. */}
      <group position={[-2.3, 0, wall + 0.24]}>
        <Walnut position={[0, FLOOR_Y + 0.31, 0]} size={[1.6, 0.62, 0.44]} />
        <Walnut
          position={[0, FLOOR_Y + 0.625, 0]}
          size={[1.66, 0.03, 0.48]}
          color="#5a3a26"
        />
        <Bottles
          count={6}
          width={1.0}
          seed={4}
          position={[-0.2, FLOOR_Y + 0.64, 0]}
        />
        <mesh position={[0.6, FLOOR_Y + 0.74, 0]} raycast={noRaycast}>
          <cylinderGeometry args={[0.1, 0.1, 0.18, 20]} />
          <meshStandardMaterial
            color="#121014"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

// South wall: a backlit bar shelf and the teal "18+" so the seats facing away
// from the neon still look at something warm.
function BarWall() {
  const wall = ROOM_HALF;
  const shelves = [0.34, 0.74, 1.14];
  return (
    <group rotation-y={Math.PI} position-z={0}>
      <group position-z={-wall}>
        {/* Counter. */}
        <Walnut position={[0, FLOOR_Y + 0.43, 0.3]} size={[2.6, 0.86, 0.56]} />
        <Walnut
          position={[0, FLOOR_Y + 0.875, 0.3]}
          size={[2.7, 0.03, 0.62]}
          color="#4a2e1e"
        />
        <Bottles
          count={5}
          width={1.4}
          seed={8}
          position={[0.3, FLOOR_Y + 0.89, 0.4]}
        />
        {/* Kick light under the counter: the warm line seats facing the bar
            see at the top of their view. */}
        <mesh position={[0, FLOOR_Y + 0.03, 0.6]} raycast={noRaycast}>
          <boxGeometry args={[2.5, 0.008, 0.01]} />
          <meshBasicMaterial
            color={new Color(BAR_AMBER).multiplyScalar(1.6)}
            toneMapped={false}
          />
        </mesh>
        {[-0.8, 0, 0.8].map(x => (
          <Stool key={x} position={[x, FLOOR_Y, 0.95]} />
        ))}
        <Taps position={[-0.85, FLOOR_Y + 0.89, 0.34]} />
        <Crates position={[-1.85, FLOOR_Y, 0.3]} />
        <Chalkboard position={[-1.95, 0.42, 0.02]} />

        {/* Backlit panel behind the shelves. */}
        <mesh position={[0, 0.5, 0.02]} raycast={noRaycast}>
          <planeGeometry args={[2.5, 1.5]} />
          <meshBasicMaterial
            map={glowTexture()}
            color={new Color(BAR_AMBER).multiplyScalar(0.7)}
          />
        </mesh>
        {shelves.map((y, index) => (
          <group key={y} position-y={y}>
            <Walnut
              position={[0, 0, 0.14]}
              size={[2.3, 0.025, 0.26]}
              color="#5a3a26"
            />
            <mesh position={[0, -0.016, 0.25]} raycast={noRaycast}>
              <boxGeometry args={[2.24, 0.006, 0.01]} />
              <meshBasicMaterial
                color={new Color(BAR_AMBER).multiplyScalar(1.6)}
                toneMapped={false}
              />
            </mesh>
            <Bottles
              count={9 - index}
              width={2.05}
              seed={20 + index}
              position={[0, 0.013, 0.13]}
            />
          </group>
        ))}
        <pointLight
          position={[0, 0.55, 1.4]}
          color={BAR_AMBER}
          intensity={3}
          distance={3}
          decay={1.6}
        />

        <group position={[1.9, 0.18, 0.06]}>
          <NeonTubes
            strokes={ADULTS}
            scale={0.42}
            color={NEON_TEAL}
            intensity={1.5}
            radius={0.01}
          />
        </group>
        <WallGlow
          position={[1.9, 0.18, 0.02]}
          size={[1.3, 1.3]}
          color={NEON_TEAL}
          strength={0.16}
        />
      </group>
    </group>
  );
}

type PosterProps = {
  index: number;
  position: [number, number, number];
  yaw: number;
};

// A framed poster under a little brass picture light.
function Poster({ index, position, yaw }: PosterProps) {
  const map = posterTexture(index);
  return (
    <group position={position} rotation-y={yaw}>
      <mesh position-z={0.015} raycast={noRaycast}>
        <boxGeometry args={[0.66, 0.94, 0.03]} />
        <meshStandardMaterial color="#0c0a09" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position-z={0.032} raycast={noRaycast}>
        <planeGeometry args={[0.58, 0.86]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 0.56, 0.07]} raycast={noRaycast}>
        <boxGeometry args={[0.36, 0.025, 0.04]} />
        <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.545, 0.07]} raycast={noRaycast}>
        <boxGeometry args={[0.32, 0.004, 0.02]} />
        <meshBasicMaterial color={[1.6, 1.3, 0.9]} toneMapped={false} />
      </mesh>
    </group>
  );
}

// West wall: a worn sofa under the posters and a little table lamp, a warm
// spot low enough for the side seats to catch.
function Lounge() {
  const envMap = useEnvMap();
  const leather = (
    <meshStandardMaterial
      color="#6a2218"
      roughness={0.5}
      envMap={envMap}
      envMapIntensity={0.5}
    />
  );
  const parts: {
    position: [number, number, number];
    size: [number, number, number];
  }[] = [
    { position: [0, FLOOR_Y + 0.27, 0], size: [1.9, 0.26, 0.8] },
    { position: [0, FLOOR_Y + 0.6, -0.32], size: [1.9, 0.5, 0.2] },
    { position: [-1.0, FLOOR_Y + 0.45, 0], size: [0.18, 0.36, 0.8] },
    { position: [1.0, FLOOR_Y + 0.45, 0], size: [0.18, 0.36, 0.8] }
  ];
  return (
    <group position={[-ROOM_HALF + 0.5, 0, 0]} rotation-y={Math.PI / 2}>
      {parts.map(part => (
        <mesh
          key={part.position.join()}
          position={part.position}
          raycast={noRaycast}
        >
          <boxGeometry args={part.size} />
          {leather}
        </mesh>
      ))}
      <Walnut
        position={[0, FLOOR_Y + 0.07, 0]}
        size={[1.9, 0.1, 0.76]}
        color="#3a281e"
      />

      <group position={[1.55, 0, -0.1]}>
        <Walnut position={[0, FLOOR_Y + 0.3, 0]} size={[0.44, 0.6, 0.44]} />
        <mesh position-y={FLOOR_Y + 0.68} raycast={noRaycast}>
          <cylinderGeometry args={[0.02, 0.06, 0.16, 12]} />
          <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.3} />
        </mesh>
        <mesh position-y={FLOOR_Y + 0.84} raycast={noRaycast}>
          <cylinderGeometry args={[0.08, 0.14, 0.18, 20, 1, true]} />
          <meshBasicMaterial
            color={[1.5, 1.15, 0.7]}
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
      <WallGlow
        position={[1.55, FLOOR_Y + 0.9, -0.38]}
        size={[1.6, 1.4]}
        color="#ffb46a"
        strength={0.18}
      />
    </group>
  );
}

type SconceProps = { position: [number, number, number] };

// A brass wall sconce with a frosted glass tube: a warm accent at eye level.
function Sconce({ position }: SconceProps) {
  return (
    <group position={position}>
      <mesh position-z={0.01} raycast={noRaycast}>
        <boxGeometry args={[0.07, 0.16, 0.02]} />
        <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0.07]} raycast={noRaycast}>
        <cylinderGeometry args={[0.035, 0.03, 0.17, 16]} />
        <meshBasicMaterial color={[1.6, 1.25, 0.8]} toneMapped={false} />
      </mesh>
      <WallGlow
        position={[0, 0.05, 0.004]}
        size={[0.8, 1.1]}
        color={LAMP_WARM}
        strength={0.2}
      />
    </group>
  );
}

// East wall: a closed door, the hallway light leaking around it, and a
// sconce beside it so the seats facing this way see a warm mark.
function Door() {
  const leak = new Color(1, 0.72, 0.4);
  return (
    <group position={[ROOM_HALF, 0, 1.4]} rotation-y={-Math.PI / 2}>
      <Walnut
        position={[0, FLOOR_Y + 1.05, 0.03]}
        size={[1.02, 2.1, 0.06]}
        color="#8a644c"
      />
      {/* Painted, the one cool colour on this wall. */}
      <mesh position={[0, FLOOR_Y + 1.03, 0.065]} raycast={noRaycast}>
        <boxGeometry args={[0.88, 2.04, 0.02]} />
        <meshStandardMaterial
          color="#2a9d8f"
          emissive="#2a9d8f"
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0.34, FLOOR_Y + 1.0, 0.09]} raycast={noRaycast}>
        <sphereGeometry args={[0.025, 12, 8]} />
        <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.008, 0.08]} raycast={noRaycast}>
        <boxGeometry args={[0.86, 0.006, 0.004]} />
        <meshBasicMaterial color={leak} toneMapped={false} />
      </mesh>
      {/* The gap on the latch side, brightest low down. */}
      <mesh position={[0.445, FLOOR_Y + 0.75, 0.08]} raycast={noRaycast}>
        <boxGeometry args={[0.004, 1.5, 0.004]} />
        <meshBasicMaterial color={leak} toneMapped={false} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 2.26, 0.04]} raycast={noRaycast}>
        <boxGeometry args={[0.42, 0.16, 0.05]} />
        <meshBasicMaterial map={exitTexture()} />
      </mesh>
      <Sconce position={[-0.85, 0.22, 0]} />
    </group>
  );
}

function leafGeometry(): ShapeGeometry {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.07, 0.18, 0, 0.42);
  shape.quadraticCurveTo(-0.07, 0.18, 0, 0);
  return new ShapeGeometry(shape, 6);
}

const LEAF_COUNT = 22;

function Plant({
  position,
  seed
}: {
  position: [number, number, number];
  seed: number;
}) {
  const envMap = useEnvMap();
  const leaves = useRef<InstancedMesh>(null);
  const leaf = useMemo(() => leafGeometry(), []);
  const pot = useMemo(
    () =>
      new LatheGeometry(
        [
          [0, 0],
          [0.15, 0],
          [0.2, 0.36],
          [0.21, 0.38],
          [0.19, 0.38],
          [0, 0.36]
        ].map(([x, y]) => new Vector2(x, y)),
        24
      ),
    []
  );

  useLayoutEffect(() => {
    const mesh = leaves.current;
    if (!mesh) return;
    const random = seeded(seed);
    const stem = new Matrix4();
    const blade = new Matrix4();
    const turn = new Quaternion();
    const offset = new Vector3();
    const size = new Vector3();
    for (let index = 0; index < LEAF_COUNT; index++) {
      const yaw = random() * Math.PI * 2;
      const tilt = 0.25 + random() * 0.9;
      const height = 0.3 + random() * 0.5;
      const scale = 0.8 + random() * 0.7;
      stem.makeRotationY(yaw).setPosition(0, 0.36, 0);
      blade.compose(
        offset.set(0, height * 0.4, 0),
        turn.setFromEuler(new Euler(tilt, 0, 0)),
        size.setScalar(scale)
      );
      mesh.setMatrixAt(index, stem.multiply(blade));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [seed]);

  return (
    <group position={position}>
      <mesh geometry={pot} raycast={noRaycast}>
        <meshStandardMaterial color="#8a4a2c" roughness={0.8} />
      </mesh>
      <instancedMesh
        ref={leaves}
        args={[leaf, undefined, LEAF_COUNT]}
        frustumCulled={false}
        raycast={noRaycast}
      >
        <meshStandardMaterial
          color="#2f7a3c"
          roughness={0.55}
          side={DoubleSide}
          envMap={envMap}
          envMapIntensity={0.25}
        />
      </instancedMesh>
    </group>
  );
}

type Placed = { position: [number, number, number] };

const BRASS = '#c99a4e';

// A bar stool: red vinyl seat on a brass post.
function Stool({ position }: Placed) {
  return (
    <group position={position}>
      <mesh position-y={0.64} raycast={noRaycast}>
        <cylinderGeometry args={[0.17, 0.15, 0.07, 20]} />
        <meshStandardMaterial color="#a3241c" roughness={0.45} />
      </mesh>
      <mesh position-y={0.31} raycast={noRaycast}>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 10]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position-y={0.2} rotation-x={Math.PI / 2} raycast={noRaycast}>
        <torusGeometry args={[0.13, 0.01, 6, 20]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position-y={0.012} raycast={noRaycast}>
        <cylinderGeometry args={[0.15, 0.17, 0.024, 20]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

const TAP_HANDLES = ['#d8372a', '#f2c230', '#2f9a55'];

// The draught tower on the counter, one bright handle per beer.
function Taps({ position }: Placed) {
  return (
    <group position={position}>
      <mesh position-y={0.11} raycast={noRaycast}>
        <cylinderGeometry args={[0.025, 0.035, 0.22, 12]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position-y={0.23} raycast={noRaycast}>
        <boxGeometry args={[0.36, 0.05, 0.06]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.25} />
      </mesh>
      {TAP_HANDLES.map((color, index) => (
        <mesh
          key={color}
          position={[(index - 1) * 0.12, 0.31, 0]}
          raycast={noRaycast}
        >
          <cylinderGeometry args={[0.02, 0.013, 0.12, 10]} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

const CRATE_COLORS = ['#e0a81a', '#c2301f', '#e0a81a'];

// Beer crates stacked by the bar, a little askew.
function Crates({ position }: Placed) {
  return (
    <group position={position}>
      {CRATE_COLORS.map((color, index) => (
        <mesh
          key={index}
          position={[0, 0.14 + index * 0.285, 0]}
          rotation-y={(index - 1) * 0.12}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.44, 0.28, 0.32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Lit just enough by its own print to read from across the room.
function Chalkboard({ position }: Placed) {
  const map = chalkboardTexture();
  return (
    <group position={position}>
      <Walnut position={[0, 0, 0.012]} size={[1.0, 0.75, 0.024]} />
      <mesh position-z={0.026} raycast={noRaycast}>
        <planeGeometry args={[0.92, 0.67]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function Dartboard({ position }: Placed) {
  const map = dartboardTexture();
  return (
    <group position={position}>
      <mesh rotation-x={Math.PI / 2} position-z={0.015} raycast={noRaycast}>
        <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
        <meshStandardMaterial color="#16120f" roughness={0.8} />
      </mesh>
      <mesh position-z={0.032} raycast={noRaycast}>
        <circleGeometry args={[0.24, 32]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

const JUKEBOX_WIDTH = 0.72;
const JUKEBOX_HEIGHT = 1.35;

// East wall: a jukebox, its whole front one self-lit picture.
function Jukebox({ z }: { z: number }) {
  const shoulder = JUKEBOX_HEIGHT - JUKEBOX_WIDTH / 2;
  return (
    <group position={[ROOM_HALF, FLOOR_Y, z]} rotation-y={-Math.PI / 2}>
      <Walnut
        position={[0, shoulder / 2, 0.2]}
        size={[JUKEBOX_WIDTH, shoulder, 0.4]}
        color="#6a4630"
      />
      <mesh
        position={[0, shoulder, 0.2]}
        rotation-x={Math.PI / 2}
        raycast={noRaycast}
      >
        <cylinderGeometry
          args={[JUKEBOX_WIDTH / 2, JUKEBOX_WIDTH / 2, 0.4, 24]}
        />
        <meshStandardMaterial
          map={walnutTexture()}
          color="#6a4630"
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, JUKEBOX_HEIGHT / 2, 0.405]} raycast={noRaycast}>
        <planeGeometry args={[JUKEBOX_WIDTH, JUKEBOX_HEIGHT]} />
        <meshBasicMaterial map={jukeboxTexture()} alphaTest={0.5} />
      </mesh>
    </group>
  );
}

const BULB_COLORS = ['#ffb347', '#ff5fa8', '#ffe066', '#4fe0d0', '#ff6b4a'];
const BULBS_PER_SPAN = 7;
const SPAN = 2.4;
const SAG = 0.22;
const WIRE_STEPS = 10;

// One sagging string of party bulbs along a wall, in the wall's own frame:
// x along the wall, z out of it.
type BulbRun = {
  yaw: number;
  top: number;
  // Distance from the wall, to clear what hangs on it.
  inset: number;
};

const BULB_RUNS: BulbRun[] = [
  { yaw: 0, top: 0.66, inset: 0.12 },
  { yaw: Math.PI, top: 1.2, inset: 0.5 },
  { yaw: -Math.PI / 2, top: 1.0, inset: 0.5 },
  { yaw: Math.PI / 2, top: 1.0, inset: 0.12 }
];

// Coloured bulbs strung around the room: unlit, one draw call.
function PartyLights() {
  const mesh = useRef<InstancedMesh>(null);
  const wire = useRef<BufferGeometry>(null);
  const spans = Math.round((ROOM_HALF * 2) / SPAN);
  const count = BULB_RUNS.length * spans * BULBS_PER_SPAN;

  useLayoutEffect(() => {
    const bulbs = mesh.current;
    if (!bulbs) return;
    const dummy = new Object3D();
    const color = new Color();
    const spot = new Vector3();
    const up = new Vector3(0, 1, 0);
    // Where the string hangs, `t` of the way along one span.
    const hang = (run: BulbRun, span: number, t: number) =>
      spot
        .set(
          -ROOM_HALF + (span + t) * SPAN,
          run.top - SAG * 4 * t * (1 - t),
          -ROOM_HALF + run.inset
        )
        .applyAxisAngle(up, run.yaw);
    const cord: number[] = [];
    let index = 0;
    for (const run of BULB_RUNS) {
      for (let span = 0; span < spans; span++) {
        for (let step = 0; step < WIRE_STEPS; step++) {
          cord.push(...hang(run, span, step / WIRE_STEPS).toArray());
          cord.push(...hang(run, span, (step + 1) / WIRE_STEPS).toArray());
        }
        for (let bulb = 0; bulb < BULBS_PER_SPAN; bulb++) {
          hang(run, span, (bulb + 0.5) / BULBS_PER_SPAN);
          spot.y -= 0.02;
          dummy.position.copy(spot);
          dummy.updateMatrix();
          bulbs.setMatrixAt(index, dummy.matrix);
          bulbs.setColorAt(
            index,
            color.set(BULB_COLORS[index % BULB_COLORS.length])
          );
          index++;
        }
      }
    }
    bulbs.instanceMatrix.needsUpdate = true;
    if (bulbs.instanceColor) bulbs.instanceColor.needsUpdate = true;
    wire.current?.setAttribute('position', new Float32BufferAttribute(cord, 3));
  }, [spans]);

  return (
    <group>
      <lineSegments frustumCulled={false} raycast={noRaycast}>
        <bufferGeometry ref={wire} />
        <lineBasicMaterial color="#4a3c30" />
      </lineSegments>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
        raycast={noRaycast}
      >
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/**
 * The room around the table: floor and rug, walls, the CAHO neon sign, the
 * bar, a jukebox, posters, a door, party lights and plants.
 *
 * @example
 * <Room />
 */
export function Room() {
  return (
    <group>
      <Floor />
      <Walls />
      <NeonWall />
      <BarWall />
      <Door />
      <Lounge />
      <Jukebox z={-0.1} />
      <PartyLights />
      <Poster
        index={2}
        position={[ROOM_HALF - 0.02, 0.18, -1.3]}
        yaw={-Math.PI / 2}
      />
      <Poster
        index={0}
        position={[-ROOM_HALF + 0.02, 0.18, -0.85]}
        yaw={Math.PI / 2}
      />
      <Poster
        index={1}
        position={[-ROOM_HALF + 0.02, 0.18, 0.85]}
        yaw={Math.PI / 2}
      />
      <Plant
        position={[-ROOM_HALF + 0.45, FLOOR_Y, -ROOM_HALF + 0.45]}
        seed={1}
      />
      <Plant
        position={[ROOM_HALF - 0.45, FLOOR_Y, ROOM_HALF - 0.45]}
        seed={2}
      />
      <Plant
        position={[-ROOM_HALF + 0.45, FLOOR_Y, ROOM_HALF - 0.45]}
        seed={3}
      />
    </group>
  );
}
