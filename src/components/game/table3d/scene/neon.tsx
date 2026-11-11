'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Color,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type MeshBasicMaterial
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { seeded } from './textures';

type Point = [x: number, y: number];
// One bent glass tube, as a polyline in the sign's own units.
type Stroke = Point[];

function arc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  from: number,
  to: number,
  steps = 28
): Stroke {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = from + ((to - from) * i) / steps;
    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry];
  });
}

// Bent glass has no sharp corners: round every corner of a polyline.
function roundCorners(stroke: Stroke, radius: number): Stroke {
  if (stroke.length < 3) return stroke;
  const out: Stroke = [stroke[0]];
  for (let i = 1; i < stroke.length - 1; i++) {
    const [px, py] = stroke[i - 1];
    const [x, y] = stroke[i];
    const [nx, ny] = stroke[i + 1];
    const inLength = Math.hypot(x - px, y - py);
    const outLength = Math.hypot(nx - x, ny - y);
    const r = Math.min(radius, inLength / 2, outLength / 2);
    const a: Point = [
      x - ((x - px) / inLength) * r,
      y - ((y - py) / inLength) * r
    ];
    const b: Point = [
      x + ((nx - x) / outLength) * r,
      y + ((ny - y) / outLength) * r
    ];
    for (let s = 0; s <= 6; s++) {
      const t = s / 6;
      out.push([
        (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * x + t * t * b[0],
        (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * y + t * t * b[1]
      ]);
    }
  }
  out.push(stroke[stroke.length - 1]);
  return out;
}

// Straight runs need intermediate points or the spline bows them.
function densify(stroke: Stroke, step: number): Stroke {
  const out: Stroke = [];
  for (let i = 0; i < stroke.length - 1; i++) {
    const [x, y] = stroke[i];
    const [nx, ny] = stroke[i + 1];
    const count = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y) / step));
    for (let s = 0; s < count; s++) {
      out.push([x + ((nx - x) * s) / count, y + ((ny - y) * s) / count]);
    }
  }
  out.push(stroke[stroke.length - 1]);
  return out;
}

// "CAHO", one letter per entry, in units of the cap height, left at x = 0.
const CAHO_LETTERS: { strokes: Stroke[]; width: number }[] = [
  {
    strokes: [arc(0.42, 0.5, 0.42, 0.5, 0.95, Math.PI * 2 - 0.95)],
    width: 0.78
  },
  {
    strokes: [
      [
        [0, 0],
        [0.4, 1],
        [0.8, 0]
      ],
      [
        [0.17, 0.36],
        [0.63, 0.36]
      ]
    ],
    width: 0.8
  },
  {
    strokes: [
      [
        [0, 0],
        [0, 1]
      ],
      [
        [0.7, 0],
        [0.7, 1]
      ],
      [
        [0, 0.52],
        [0.7, 0.52]
      ]
    ],
    width: 0.7
  },
  {
    strokes: [arc(0.43, 0.5, 0.43, 0.5, Math.PI / 2, Math.PI * 2.5, 48)],
    width: 0.86
  }
];

const LETTER_GAP = 0.26;

/**
 * The CAHO wordmark as neon strokes, centred on the origin, one array of
 * strokes per letter.
 *
 * @example
 * <NeonTubes strokes={cahoStrokes().flat()} />
 */
export function cahoStrokes(): Stroke[][] {
  const total =
    CAHO_LETTERS.reduce((sum, letter) => sum + letter.width, 0) +
    LETTER_GAP * (CAHO_LETTERS.length - 1);
  let x = -total / 2;
  return CAHO_LETTERS.map(letter => {
    const strokes = letter.strokes.map(stroke =>
      stroke.map(([px, py]): Point => [px + x, py - 0.5])
    );
    x += letter.width + LETTER_GAP;
    return strokes;
  });
}

/**
 * "18+" in a ring, centred on the origin, for the bar's teal sign.
 *
 * @example
 * <NeonTubes strokes={adultsOnlyStrokes()} />
 */
export function adultsOnlyStrokes(): Stroke[] {
  return [
    arc(0, 0, 0.62, 0.62, 0, Math.PI * 2, 64),
    [
      [-0.38, 0.16],
      [-0.27, 0.28],
      [-0.27, -0.28]
    ],
    arc(-0.02, 0.15, 0.12, 0.12, -Math.PI / 2, Math.PI * 1.5, 32),
    arc(-0.02, -0.15, 0.14, 0.14, Math.PI / 2, Math.PI * 2.5, 32),
    [
      [0.2, 0],
      [0.46, 0]
    ],
    [
      [0.33, -0.13],
      [0.33, 0.13]
    ]
  ];
}

function tubeGeometry(
  strokes: Stroke[],
  scale: number,
  radius: number
): BufferGeometry {
  const tubes = strokes.map(stroke => {
    const points = densify(roundCorners(stroke, 0.07), 0.08).map(
      ([x, y]) => new Vector3(x * scale, y * scale, 0)
    );
    const curve = new CatmullRomCurve3(points, false, 'centripetal');
    return new TubeGeometry(curve, Math.max(8, points.length * 3), radius, 8);
  });
  const merged = mergeGeometries(tubes);
  for (const tube of tubes) tube.dispose();
  return merged;
}

type NeonTubesProps = {
  strokes: Stroke[];
  // World size of one sign unit.
  scale: number;
  color: string;
  // HDR multiplier: the core blooms, tone mapping whitens it.
  intensity: number;
  radius?: number;
  // Old neon buzzes: this tube stutters now and then.
  isFlickering?: boolean;
};

/**
 * Glowing glass tubes along `strokes`. Unlit and above 1, so bloom picks
 * them up.
 *
 * @example
 * <NeonTubes strokes={adultsOnlyStrokes()} scale={0.4} color="#2fe0d0" intensity={4} />
 */
export function NeonTubes({
  strokes,
  scale,
  color,
  intensity,
  radius = 0.011,
  isFlickering = false
}: NeonTubesProps) {
  const geometry = useMemo(
    () => tubeGeometry(strokes, scale, radius),
    [strokes, scale, radius]
  );
  const material = useRef<MeshBasicMaterial>(null);
  const lit = useMemo(
    () => new Color(color).multiplyScalar(intensity),
    [color, intensity]
  );
  const flicker = useMemo(() => {
    const random = seeded(99);
    return { random, nextAt: 6 + random() * 8, until: 0 };
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!isFlickering || !material.current) return;
    const time = clock.elapsedTime;
    if (time > flicker.nextAt) {
      flicker.until = time + 0.25 + flicker.random() * 0.5;
      flicker.nextAt = flicker.until + 7 + flicker.random() * 12;
    }
    const isBuzzing = time < flicker.until;
    // A dying tube stutters between dim and full, never fully dark.
    const level = isBuzzing
      ? Math.sin(time * 90) * Math.sin(time * 37) > 0
        ? 1
        : 0.12
      : 1;
    material.current.color.copy(lit).multiplyScalar(level);
  });

  return (
    <mesh geometry={geometry} raycast={() => null}>
      <meshBasicMaterial ref={material} color={lit} toneMapped={false} />
    </mesh>
  );
}
