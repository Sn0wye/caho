'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  Material,
  MathUtils,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3
} from 'three';
import { FELT_RADIUS } from '../space';
import { seeded } from './textures';

// The bottom of the shade. The seated camera's top edge passes y ≈ 1.05 over
// the centre, and anything lower would sit on the far Players' names: keep
// it out of the seat view; it drifts in when zoomed out or orbited.
export const LAMP_Y = 1.62;
export const CEILING_Y = 2.6;
const SHADE_RADIUS = 0.27;
const SHADE_HEIGHT = 0.2;
const BULB_Y = LAMP_Y + 0.07;
// The visible beam: from the shade's mouth to just over the table's edge.
const BEAM_BOTTOM_RADIUS = 1.18;
const KEY_COLOR = '#ffdcb0';
const BEAM_STRENGTH = 0.08;

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

const beamVertex = /* glsl */ `
  varying float vHeight;
  varying float vFacing;
  varying vec3 vWorld;
  void main() {
    vHeight = uv.y;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec3 normal = normalize(mat3(modelMatrix) * normal);
    vFacing = abs(dot(normal, normalize(cameraPosition - world.xyz)));
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uStrength;
  varying float vHeight;
  varying float vFacing;
  varying vec3 vWorld;
  void main() {
    // Dense at the shade, gone before it reaches the felt; a soft silhouette
    // with no rim, like light in haze rather than a glass cone.
    float along = smoothstep(-0.15, 1.0, vHeight);
    along = pow(along, 1.6);
    float edge = pow(vFacing, 2.6);
    // Slow drifting density so the haze breathes.
    float swirl = 0.75 + 0.25 * sin(vWorld.x * 5.0 + uTime * 0.23)
      * sin(vWorld.z * 4.0 - uTime * 0.17 + vWorld.y * 3.0);
    gl_FragColor = vec4(uColor * along * edge * swirl * uStrength, 1.0);
  }
`;

const moteVertex = /* glsl */ `
  attribute vec4 seed;
  uniform float uTime;
  uniform float uScale;
  uniform float uTop;
  uniform float uBottom;
  uniform float uTopRadius;
  uniform float uBottomRadius;
  varying float vAlpha;
  void main() {
    float range = uTop - uBottom;
    // Sink slowly and wrap, swaying on the air currents.
    float y = uBottom + mod(seed.y - uTime * (0.006 + seed.w * 0.01), range);
    vec3 p = vec3(seed.x, y, seed.z);
    p.x += sin(uTime * 0.21 + seed.w * 40.0) * 0.05;
    p.z += cos(uTime * 0.17 + seed.w * 23.0) * 0.05;
    // Only motes inside the beam catch the light.
    float t = (uTop + 0.08 - y) / (uTop + 0.08);
    float coneRadius = mix(uTopRadius, uBottomRadius, t) * 0.85;
    float inside = 1.0 - smoothstep(coneRadius * 0.55, coneRadius, length(p.xz));
    float ends = smoothstep(0.0, 0.15, (y - uBottom) / range)
      * smoothstep(1.0, 0.8, (y - uBottom) / range);
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + seed.w * 2.0) + seed.w * 90.0);
    vAlpha = inside * ends * twinkle;
    vec4 view = viewMatrix * modelMatrix * vec4(p, 1.0);
    gl_PointSize = (0.0045 + seed.w * 0.004) * uScale / -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const moteFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor * disc * vAlpha, 1.0);
  }
`;

const MOTE_COUNT = 420;

function DustMotes() {
  const size = useThree(state => state.size);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: moteVertex,
        fragmentShader: moteFragment,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: 900 },
          uTop: { value: LAMP_Y - 0.05 },
          uBottom: { value: 0.32 },
          uTopRadius: { value: SHADE_RADIUS },
          uBottomRadius: { value: BEAM_BOTTOM_RADIUS },
          uColor: { value: new Color(KEY_COLOR).multiplyScalar(0.55) }
        },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false
      }),
    []
  );
  const geometry = useMemo(() => {
    const random = seeded(77);
    const seeds = new Float32Array(MOTE_COUNT * 4);
    for (let i = 0; i < MOTE_COUNT; i++) {
      const radius = Math.sqrt(random()) * 0.95;
      const angle = random() * Math.PI * 2;
      seeds[i * 4] = Math.cos(angle) * radius;
      seeds[i * 4 + 1] = random() * (LAMP_Y - 0.15);
      seeds[i * 4 + 2] = Math.sin(angle) * radius;
      seeds[i * 4 + 3] = random();
    }
    const result = new BufferGeometry();
    result.setAttribute('seed', new BufferAttribute(seeds, 4));
    // Positions are computed in the shader; three still wants one.
    result.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(MOTE_COUNT * 3), 3)
    );
    return result;
  }, []);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry]
  );

  useFrame(({ clock, camera, viewport }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    const fov = 'fov' in camera ? (camera.fov as number) : 38;
    material.uniforms.uScale.value =
      (size.height * viewport.dpr) / (2 * Math.tan((fov * Math.PI) / 360));
  });

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      raycast={noRaycast}
    />
  );
}

/**
 * The pendant lamp over the table: shade, cord, glowing bulb, the warm key
 * spot with the table's shadows, a faked light cone and dust in the beam.
 *
 * @example
 * <Lamp />
 */
export function Lamp() {
  const shade = useMemo(() => new LatheGeometry(shadeProfile(), 48), []);
  const beam = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        uniforms: {
          uColor: { value: new Color(KEY_COLOR) },
          uTime: { value: 0 },
          uStrength: { value: BEAM_STRENGTH }
        },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        side: DoubleSide
      }),
    []
  );

  useEffect(
    () => () => {
      shade.dispose();
      beam.dispose();
    },
    [shade, beam]
  );

  const hardware = useRef<Group>(null);
  const fade = useRef(1);
  useFrame(({ clock, camera }, delta) => {
    beam.uniforms.uTime.value = clock.elapsedTime;
    // Seen from above, the shade would sit right on the cards: fade it out
    // while its silhouette lands on the felt.
    const target = lampCoverage(camera.position) > 0.5 ? 0 : 1;
    fade.current += (target - fade.current) * Math.min(1, delta * 6);
    beam.uniforms.uStrength.value =
      BEAM_STRENGTH * (0.25 + 0.75 * fade.current);
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

      <mesh
        position-y={LAMP_Y / 2 + 0.01}
        material={beam}
        raycast={noRaycast}
        renderOrder={2}
      >
        <cylinderGeometry
          args={[
            SHADE_RADIUS * 0.92,
            BEAM_BOTTOM_RADIUS,
            LAMP_Y - 0.02,
            64,
            1,
            true
          ]}
        />
      </mesh>

      <DustMotes />
    </group>
  );
}
