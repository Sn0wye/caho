import { BufferGeometry, Float32BufferAttribute, PlaneGeometry } from 'three';
import { CARD_CORNER, CARD_HEIGHT, CARD_THICKNESS, CARD_WIDTH } from '../space';

// The card slab and the deck stacks share one builder: a rounded rectangle in
// local XY, extruded along Z. Face (+Z) and back (-Z) get their own UVs so the
// back texture reads the right way round from behind.

type Point = [x: number, y: number];

function roundedOutline(
  width: number,
  height: number,
  radius: number,
  segments: number
): Point[] {
  const hw = width / 2 - radius;
  const hh = height / 2 - radius;
  // Counter-clockwise from the bottom-right corner.
  const corners: [cx: number, cy: number, start: number][] = [
    [hw, -hh, -Math.PI / 2],
    [hw, hh, 0],
    [-hw, hh, Math.PI / 2],
    [-hw, -hh, Math.PI]
  ];
  const points: Point[] = [];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= segments; i++) {
      const angle = start + (i / segments) * (Math.PI / 2);
      points.push([
        cx + Math.cos(angle) * radius,
        cy + Math.sin(angle) * radius
      ]);
    }
  }
  return points;
}

type SlabOptions = {
  width: number;
  height: number;
  depth: number;
  radius: number;
  // A card's thin edge samples one texel of the back texture (its border
  // colour) and shares the back's draw call; a deck's tall sides get their
  // own material, wrapped so stripes read as stacked card edges.
  isCard: boolean;
};

function buildSlab({
  width,
  height,
  depth,
  radius,
  isCard
}: SlabOptions): BufferGeometry {
  const outline = roundedOutline(width, height, radius, 5);
  const count = outline.length;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const face: number[] = [];
  const back: number[] = [];
  const sides: number[] = [];
  const half = depth / 2;

  const vertex = (
    x: number,
    y: number,
    z: number,
    n: [number, number, number],
    u: number,
    v: number
  ) => {
    positions.push(x, y, z);
    normals.push(...n);
    uvs.push(u, v);
    return positions.length / 3 - 1;
  };

  // Face and back: convex, so a fan from the centre.
  const faceCentre = vertex(0, 0, half, [0, 0, 1], 0.5, 0.5);
  const faceRing = outline.map(([x, y]) =>
    vertex(x, y, half, [0, 0, 1], x / width + 0.5, y / height + 0.5)
  );
  const backCentre = vertex(0, 0, -half, [0, 0, -1], 0.5, 0.5);
  const backRing = outline.map(([x, y]) =>
    vertex(x, y, -half, [0, 0, -1], 0.5 - x / width, y / height + 0.5)
  );
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    face.push(faceCentre, faceRing[i], faceRing[next]);
    back.push(backCentre, backRing[next], backRing[i]);
  }

  let perimeter = 0;
  for (let i = 0; i < count; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = outline[(i + 1) % count];
    const length = Math.hypot(x1 - x0, y1 - y0);
    if (length < 1e-6) continue;
    const n: [number, number, number] = [
      (y1 - y0) / length,
      -(x1 - x0) / length,
      0
    ];
    const u0 = isCard ? 0.01 : perimeter;
    const u1 = isCard ? 0.01 : perimeter + length;
    const top = isCard ? 0.5 : 1;
    const bottom = isCard ? 0.5 : 0;
    const a = vertex(x0, y0, half, n, u0, top);
    const b = vertex(x1, y1, half, n, u1, top);
    const c = vertex(x1, y1, -half, n, u1, bottom);
    const d = vertex(x0, y0, -half, n, u0, bottom);
    sides.push(a, d, c, a, c, b);
    perimeter += length;
  }
  if (!isCard) {
    // Normalise u to 0–1 around the perimeter.
    for (let i = 0; i < uvs.length; i += 2) {
      const index = i / 2;
      if (index > backRing[count - 1]) uvs[i] /= perimeter;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  if (isCard) {
    geometry.setIndex([...face, ...back, ...sides]);
    geometry.addGroup(0, face.length, 0);
    geometry.addGroup(face.length, back.length + sides.length, 1);
  } else {
    geometry.setIndex([...face, ...back, ...sides]);
    geometry.addGroup(0, face.length, 0);
    geometry.addGroup(face.length, back.length, 1);
    geometry.addGroup(face.length + back.length, sides.length, 2);
  }
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}

let cardGeometry: BufferGeometry | null = null;

/**
 * The one card slab every card mesh shares. Groups: 0 face, 1 back and edge.
 *
 * @example
 * <mesh geometry={getCardGeometry()} material={[face, back]} />
 */
export function getCardGeometry(): BufferGeometry {
  cardGeometry ??= buildSlab({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    depth: CARD_THICKNESS,
    radius: CARD_CORNER,
    isCard: true
  });
  return cardGeometry;
}

/**
 * A deck: `depth` worth of cards as one slab. Groups: 0 face (bottom), 1 back
 * (top when lying face down), 2 the striped sides.
 *
 * @example
 * const geometry = makeDeckGeometry(0.04);
 */
export function makeDeckGeometry(depth: number): BufferGeometry {
  return buildSlab({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    depth,
    radius: CARD_CORNER,
    isCard: false
  });
}

let glowGeometry: PlaneGeometry | null = null;

/**
 * The soft halo drawn just under a card (judge lift, chosen, winner).
 *
 * @example
 * <mesh geometry={getGlowGeometry()} />
 */
export function getGlowGeometry(): PlaneGeometry {
  glowGeometry ??= new PlaneGeometry(CARD_WIDTH * 1.5, CARD_HEIGHT * 1.36);
  return glowGeometry;
}
