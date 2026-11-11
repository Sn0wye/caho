'use client';

import { useMemo } from 'react';
import { LatheGeometry, Vector2 } from 'three';
import {
  FELT_RADIUS,
  FLOOR_Y,
  RIM_HEIGHT,
  TABLE_RADIUS,
  TABLE_THICKNESS
} from '../space';
import { useEnvMap } from './env-map';
import {
  feltColorTexture,
  feltNormalTexture,
  leatherNormalTexture,
  walnutTexture
} from './textures';

const BRASS_OUTER = FELT_RADIUS + 0.012;
const WALNUT_RADIUS = TABLE_RADIUS - 0.014;
const APRON_RADIUS = 0.86;
const APRON_BOTTOM = -TABLE_THICKNESS - 0.09;

// The padded leather bumper: a puffy superellipse swept around the table,
// from the brass inlay out to TABLE_RADIUS, its crown RIM_HEIGHT above the
// felt. Points run outer-bottom → over the top → inner so faces point out.
function rimProfile(): Vector2[] {
  const inner = BRASS_OUTER - 0.001;
  const halfWidth = (TABLE_RADIUS - inner) / 2;
  const centreX = inner + halfWidth;
  const bottom = -0.026;
  const halfHeight = (RIM_HEIGHT - bottom) / 2;
  const centreY = bottom + halfHeight;
  const exponent = 2.6;
  const points: Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI / 2 + (i / steps) * Math.PI * 1.5;
    const c = Math.cos(t);
    const s = Math.sin(t);
    points.push(
      new Vector2(
        centreX + halfWidth * Math.sign(c) * Math.abs(c) ** (2 / exponent),
        centreY + halfHeight * Math.sign(s) * Math.abs(s) ** (2 / exponent)
      )
    );
  }
  // Tuck the inner edge under the brass so no gap shows.
  points.push(new Vector2(inner, -0.004));
  return points;
}

// The pedestal, floor to apron, bottom first so faces point out.
function pedestalProfile(): Vector2[] {
  const top = APRON_BOTTOM;
  const floor = FLOOR_Y;
  return [
    [0, floor],
    [0.42, floor],
    [0.42, floor + 0.018],
    [0.38, floor + 0.03],
    [0.24, floor + 0.07],
    [0.14, floor + 0.12],
    [0.1, floor + 0.2],
    [0.085, top - 0.2],
    [0.1, top - 0.08],
    [0.16, top - 0.03],
    [0.2, top],
    [0, top]
  ].map(([x, y]) => new Vector2(x, y));
}

/**
 * The card table: emerald felt, brass inlay, padded leather rim, walnut apron
 * and pedestal. The felt is the plane y = 0 and nothing rises above it inside
 * FELT_RADIUS.
 *
 * @example
 * <Table />
 */
export function Table() {
  const envMap = useEnvMap();
  const geometries = useMemo(
    () => ({
      rim: new LatheGeometry(rimProfile(), 160),
      pedestal: new LatheGeometry(pedestalProfile(), 48)
    }),
    []
  );
  const textures = useMemo(() => {
    const feltNormal = feltNormalTexture();
    feltNormal.repeat.set(10, 10);
    const leather = leatherNormalTexture();
    leather.repeat.set(64, 1.4);
    const walnut = walnutTexture();
    return { felt: feltColorTexture(), feltNormal, leather, walnut };
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[FELT_RADIUS, 128]} />
        <meshPhysicalMaterial
          map={textures.felt}
          normalMap={textures.feltNormal}
          normalScale={[0.35, 0.35]}
          roughness={0.93}
          sheen={0.7}
          sheenRoughness={0.75}
          sheenColor="#4fb58a"
          envMap={envMap}
          envMapIntensity={0.12}
        />
      </mesh>

      {/* Brass inlay between felt and leather. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.0006} receiveShadow>
        <ringGeometry args={[FELT_RADIUS - 0.001, BRASS_OUTER, 160, 1]} />
        <meshStandardMaterial
          color="#c99a4e"
          metalness={1}
          roughness={0.26}
          envMap={envMap}
          envMapIntensity={1.4}
        />
      </mesh>

      <mesh geometry={geometries.rim} castShadow receiveShadow>
        {/* Oxblood leather with a waxed coat: the crown catches the lamp
            and the room as a soft sheen even from the low seated angle. */}
        <meshPhysicalMaterial
          color="#24100b"
          roughness={0.44}
          normalMap={textures.leather}
          normalScale={[0.22, 0.22]}
          clearcoat={0.6}
          clearcoatRoughness={0.22}
          sheen={0.4}
          sheenRoughness={0.5}
          sheenColor="#8a4a30"
          envMap={envMap}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Walnut edge under the leather, then the underside of the top. */}
      <mesh position-y={-0.026 - (TABLE_THICKNESS - 0.026) / 2} castShadow>
        <cylinderGeometry
          args={[
            WALNUT_RADIUS,
            WALNUT_RADIUS - 0.012,
            TABLE_THICKNESS - 0.026,
            128,
            1,
            false
          ]}
        />
        <meshStandardMaterial
          map={textures.walnut}
          color="#b58a6a"
          roughness={0.42}
          envMap={envMap}
          envMapIntensity={0.6}
        />
      </mesh>

      <mesh position-y={(-TABLE_THICKNESS + APRON_BOTTOM) / 2}>
        <cylinderGeometry
          args={[
            APRON_RADIUS,
            APRON_RADIUS - 0.03,
            -TABLE_THICKNESS - APRON_BOTTOM,
            96,
            1,
            false
          ]}
        />
        <meshStandardMaterial
          map={textures.walnut}
          color="#8a644c"
          roughness={0.5}
          envMap={envMap}
          envMapIntensity={0.4}
        />
      </mesh>

      <mesh geometry={geometries.pedestal} castShadow receiveShadow>
        <meshStandardMaterial
          map={textures.walnut}
          color="#a07a5e"
          roughness={0.38}
          envMap={envMap}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  );
}
