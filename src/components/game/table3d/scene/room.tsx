'use client';

import { useMemo } from 'react';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  LatheGeometry,
  Shape,
  ShapeGeometry,
  Vector2
} from 'three';
import { FLOOR_Y } from '../space';
import { useEnvMap } from './env-map';
import { CEILING_Y } from './lamp';
import { adultsOnlyStrokes, cahoStrokes, NeonTubes } from './neon';
import {
  floorTexture,
  glowTexture,
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
const LAMP_WARM = '#ffb46a';

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

const GLASS_COLORS = ['#3a1a08', '#0f2a14', '#c9d4d0', '#4a1020', '#5a3a10'];

type BottlesProps = {
  count: number;
  width: number;
  seed: number;
  position: [number, number, number];
};

// A row of bottles. Dark glass that catches the coloured lights on its edges.
function Bottles({ count, width, seed, position }: BottlesProps) {
  const envMap = useEnvMap();
  const geometries = useMemo(
    () => ({
      wine: new LatheGeometry(bottleProfile('wine'), 16),
      squat: new LatheGeometry(bottleProfile('squat'), 16)
    }),
    []
  );
  const bottles = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => ({
      x: -width / 2 + ((index + 0.3 + random() * 0.4) / count) * width,
      z: (random() - 0.5) * 0.08,
      kind: random() > 0.45 ? ('wine' as const) : ('squat' as const),
      scale: 0.85 + random() * 0.3,
      color: GLASS_COLORS[Math.floor(random() * GLASS_COLORS.length)]
    }));
  }, [count, width, seed]);
  return (
    <group position={position}>
      {bottles.map((bottle, index) => (
        <mesh
          key={index}
          geometry={geometries[bottle.kind]}
          position={[bottle.x, 0, bottle.z]}
          scale={bottle.scale}
          raycast={noRaycast}
        >
          <meshStandardMaterial
            color={bottle.color}
            roughness={0.06}
            metalness={0.1}
            envMap={envMap}
            envMapIntensity={2.2}
            transparent
            opacity={0.88}
          />
        </mesh>
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
          intensity={5}
          radius={0.016}
        />
        <NeonTubes
          strokes={CAHO_FLICKER}
          scale={SIGN_SCALE}
          color={NEON_PINK}
          intensity={5}
          radius={0.016}
        />
        <mesh position={[0.05, -0.4, 0]} raycast={noRaycast}>
          <planeGeometry args={[2.3, 0.29]} />
          <meshBasicMaterial
            map={taglineTexture()}
            color={new Color(NEON_PURPLE).multiplyScalar(5)}
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
      <WallGlow
        position={[0, SIGN_Y - 0.1, wall + 0.02]}
        size={[5, 2.8]}
        color={NEON_PINK}
        strength={0.26}
      />
      {/* Its reflection on the varnished floor: a long soft streak. */}
      <mesh
        position={[0, FLOOR_Y + 0.005, wall + 0.65]}
        rotation-x={-Math.PI / 2}
        raycast={noRaycast}
      >
        <planeGeometry args={[3, 1.2]} />
        <meshBasicMaterial
          map={glowTexture()}
          color={new Color(NEON_PINK).multiplyScalar(0.14)}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* Lights the wall and floor by the sign and dies out well before the
          table, where the warm lamp must own the colours. */}
      <pointLight
        position={[0, 0.3, wall + 0.6]}
        color={NEON_PINK}
        intensity={3.5}
        distance={2.6}
        decay={1.5}
      />

      <Sconce position={[2.5, 0.12, wall]} />

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
            color={new Color(BAR_AMBER).multiplyScalar(3)}
            toneMapped={false}
          />
        </mesh>
        <mesh
          position={[0, FLOOR_Y + 0.004, 0.85]}
          rotation-x={-Math.PI / 2}
          raycast={noRaycast}
        >
          <planeGeometry args={[3.4, 0.9]} />
          <meshBasicMaterial
            map={glowTexture()}
            color={new Color(BAR_AMBER).multiplyScalar(0.5)}
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </mesh>

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
                color={new Color(BAR_AMBER).multiplyScalar(2.6)}
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
            intensity={4}
            radius={0.01}
          />
        </group>
        <WallGlow
          position={[1.9, 0.18, 0.02]}
          size={[1.6, 1.6]}
          color={NEON_TEAL}
          strength={0.25}
        />
        <pointLight
          position={[1.9, 0.15, 0.5]}
          color={NEON_TEAL}
          intensity={1.6}
          distance={1.8}
          decay={1.5}
        />
        <Sconce position={[-2, 0.12, 0]} />
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
          emissiveIntensity={0.16}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 0.56, 0.07]} raycast={noRaycast}>
        <boxGeometry args={[0.36, 0.025, 0.04]} />
        <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.545, 0.07]} raycast={noRaycast}>
        <boxGeometry args={[0.32, 0.004, 0.02]} />
        <meshBasicMaterial color={[3, 2.2, 1.4]} toneMapped={false} />
      </mesh>
      <WallGlow
        position={[0, 0.25, 0.034]}
        size={[0.95, 0.9]}
        color="#ffcf9a"
        strength={0.1}
      />
    </group>
  );
}

// West wall: a worn sofa under the posters and a little table lamp, a warm
// spot low enough for the side seats to catch.
function Lounge() {
  const envMap = useEnvMap();
  const leather = (
    <meshStandardMaterial
      color="#2a100c"
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
            color={[2.2, 1.5, 0.8]}
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          position={[0, FLOOR_Y + 0.8, 0.2]}
          color="#ffb46a"
          intensity={1.4}
          decay={2}
        />
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
        <meshBasicMaterial color={[2.4, 1.6, 0.9]} toneMapped={false} />
      </mesh>
      <WallGlow
        position={[0, 0.05, 0.004]}
        size={[0.9, 1.3]}
        color={LAMP_WARM}
        strength={0.32}
      />
      <pointLight
        position={[0, 0.02, 0.25]}
        color={LAMP_WARM}
        intensity={0.5}
        distance={1.6}
        decay={1.5}
      />
    </group>
  );
}

// East wall: a closed door, the hallway light leaking around it, and a
// sconce beside it so the seats facing this way see a warm mark.
function Door() {
  const leak = new Color(3, 2.2, 1.3);
  return (
    <group position={[ROOM_HALF, 0, 1.4]} rotation-y={-Math.PI / 2}>
      <Walnut
        position={[0, FLOOR_Y + 1.05, 0.03]}
        size={[1.02, 2.1, 0.06]}
        color="#3a281e"
      />
      <Walnut
        position={[0, FLOOR_Y + 1.03, 0.065]}
        size={[0.88, 2.04, 0.02]}
        color="#2a1c14"
      />
      <mesh position={[0.34, FLOOR_Y + 1.0, 0.09]} raycast={noRaycast}>
        <sphereGeometry args={[0.025, 12, 8]} />
        <meshStandardMaterial color="#c99a4e" metalness={1} roughness={0.25} />
      </mesh>
      <mesh
        position={[0, FLOOR_Y + 0.003, 0.25]}
        rotation-x={-Math.PI / 2}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.95, 0.5]} />
        <meshBasicMaterial
          map={glowTexture()}
          color={[1.4, 1.0, 0.6]}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
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
      <WallGlow
        position={[0.46, FLOOR_Y + 0.7, 0.07]}
        size={[0.35, 1.9]}
        color="#ffcf9a"
        strength={0.22}
      />
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

function Plant({
  position,
  seed
}: {
  position: [number, number, number];
  seed: number;
}) {
  const envMap = useEnvMap();
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
  const leaves = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: 22 }, () => ({
      yaw: random() * Math.PI * 2,
      tilt: 0.25 + random() * 0.9,
      height: 0.3 + random() * 0.5,
      scale: 0.8 + random() * 0.7
    }));
  }, [seed]);
  return (
    <group position={position}>
      <mesh geometry={pot} raycast={noRaycast}>
        <meshStandardMaterial color="#1d1a18" roughness={0.7} />
      </mesh>
      {leaves.map((item, index) => (
        <group key={index} position-y={0.36} rotation-y={item.yaw}>
          <mesh
            geometry={leaf}
            position-y={item.height * 0.4}
            rotation-x={item.tilt}
            scale={item.scale}
            raycast={noRaycast}
          >
            <meshStandardMaterial
              color="#16301c"
              roughness={0.55}
              side={DoubleSide}
              envMap={envMap}
              envMapIntensity={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * The room around the table: floor and rug, walls, the CAHO neon sign, the
 * bar, posters, a door and plants.
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
