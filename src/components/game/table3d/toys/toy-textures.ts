import {
  CanvasTexture,
  Color,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture
} from 'three';

// Every toy surface is painted on a canvas: no image or font downloads.

// Die faces in BoxGeometry group order (+X, -X, +Y, -Y, +Z, -Z); opposite
// faces add up to 7 like a real die.
export const DIE_FACE_VALUES = [2, 5, 1, 6, 3, 4] as const;

const IVORY = '#f3ecdc';

function canvas(width: number, height = width) {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  const context = element.getContext('2d');
  if (!context) throw new Error('2D canvas unavailable');
  return { element, context };
}

function texture(element: HTMLCanvasElement, isColor = true): CanvasTexture {
  const result = new CanvasTexture(element);
  if (isColor) result.colorSpace = SRGBColorSpace;
  result.anisotropy = 8;
  return result;
}

function bodyFont(): string {
  return getComputedStyle(document.body).fontFamily || 'sans-serif';
}

// Pip centres on a 3×3 grid (0–2 per axis) for each value.
const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2]
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2]
  ],
  4: [
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2]
  ],
  5: [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2]
  ],
  6: [
    [0, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [2, 2]
  ]
};

export type DieTextures = { maps: Texture[]; bumps: Texture[] };

/**
 * One colour map and one bump map per die face, in BoxGeometry group order.
 *
 * @example
 * const { maps, bumps } = createDieTextures();
 */
export function createDieTextures(): DieTextures {
  const size = 256;
  const maps: Texture[] = [];
  const bumps: Texture[] = [];
  for (const value of DIE_FACE_VALUES) {
    const color = canvas(size);
    const bump = canvas(size);
    const c = color.context;
    const b = bump.context;

    const base = c.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.1,
      size / 2,
      size / 2,
      size * 0.75
    );
    base.addColorStop(0, '#fbf7ec');
    base.addColorStop(1, '#e6dcc6');
    c.fillStyle = base;
    c.fillRect(0, 0, size, size);
    b.fillStyle = '#fff';
    b.fillRect(0, 0, size, size);

    const isAce = value === 1;
    const radius = size * (isAce ? 0.115 : 0.085);
    for (const [gx, gy] of PIPS[value]) {
      const x = size * (0.24 + gx * 0.26);
      const y = size * (0.24 + gy * 0.26);
      // A drilled, painted pit: dark rim, a little lighter at the bottom.
      const pit = c.createRadialGradient(
        x + radius * 0.25,
        y + radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      );
      pit.addColorStop(0, isAce ? '#c42a3a' : '#2c2622');
      pit.addColorStop(0.8, isAce ? '#8d1424' : '#100d0c');
      pit.addColorStop(1, isAce ? '#6b0f1b' : '#060505');
      c.fillStyle = pit;
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2);
      c.fill();

      const depth = b.createRadialGradient(x, y, 0, x, y, radius * 1.08);
      depth.addColorStop(0, '#000');
      depth.addColorStop(0.75, '#333');
      depth.addColorStop(1, '#fff');
      b.fillStyle = depth;
      b.beginPath();
      b.arc(x, y, radius * 1.08, 0, Math.PI * 2);
      b.fill();
    }
    maps.push(texture(color.element));
    bumps.push(texture(bump.element, false));
  }
  return { maps, bumps };
}

function mix(a: string, b: string, amount: number): string {
  return `#${new Color(a).lerp(new Color(b), amount).getHexString()}`;
}

export type ChipTextures = { side: Texture; cap: Texture };

const EDGE_SPOTS = 8;
const SPOT_SHARE = 0.36;

/**
 * The classic clay chip: edge spots round the rim and a printed centre inlay.
 *
 * @example
 * const { side, cap } = createChipTextures('#5c8bd6');
 */
export function createChipTextures(color: string): ChipTextures {
  const dark = mix(color, '#000', 0.35);

  const side = canvas(512, 32);
  const s = side.context;
  s.fillStyle = color;
  s.fillRect(0, 0, 512, 32);
  const spot = (512 / EDGE_SPOTS) * SPOT_SHARE;
  for (let index = 0; index < EDGE_SPOTS; index++) {
    const x = (index + 0.5) * (512 / EDGE_SPOTS) - spot / 2;
    s.fillStyle = '#f6f1e6';
    s.fillRect(x, 0, spot, 32);
    s.fillStyle = color;
    s.fillRect(x + spot * 0.42, 0, spot * 0.16, 32);
  }
  // Worn, slightly darker edges where the face meets the rim.
  s.fillStyle = 'rgba(0,0,0,0.18)';
  s.fillRect(0, 0, 512, 3);
  s.fillRect(0, 29, 512, 3);
  const sideTexture = texture(side.element);
  sideTexture.wrapS = RepeatWrapping;

  const size = 256;
  const r = size / 2;
  const cap = canvas(size);
  const c = cap.context;
  c.fillStyle = color;
  c.fillRect(0, 0, size, size);
  c.translate(r, r);

  // Edge spots continue the rim's stripes onto the face.
  const arc = ((Math.PI * 2) / EDGE_SPOTS) * SPOT_SHARE;
  for (let index = 0; index < EDGE_SPOTS; index++) {
    const angle = (index + 0.5) * ((Math.PI * 2) / EDGE_SPOTS);
    c.fillStyle = '#f6f1e6';
    c.beginPath();
    c.arc(0, 0, r * 0.99, angle - arc / 2, angle + arc / 2);
    c.arc(0, 0, r * 0.8, angle + arc / 2, angle - arc / 2, true);
    c.closePath();
    c.fill();
  }

  // A dotted ring, then the inlay.
  c.fillStyle = 'rgba(246,241,230,0.85)';
  for (let index = 0; index < 36; index++) {
    const angle = (index / 36) * Math.PI * 2;
    c.beginPath();
    c.arc(
      Math.cos(angle) * r * 0.7,
      Math.sin(angle) * r * 0.7,
      r * 0.022,
      0,
      Math.PI * 2
    );
    c.fill();
  }
  c.fillStyle = mix(color, '#fff', 0.78);
  c.beginPath();
  c.arc(0, 0, r * 0.58, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = dark;
  c.lineWidth = r * 0.03;
  c.beginPath();
  c.arc(0, 0, r * 0.52, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = dark;
  c.font = `800 ${r * 0.27}px ${bodyFont()}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('CAHO', 0, r * 0.02);

  return { side: sideTexture, cap: texture(cap.element) };
}

/**
 * The little bubble that says what a die rolled, for values 1 to 6.
 *
 * @example
 * const labels = createDieLabels(); labels[value - 1];
 */
export function createDieLabels(): Texture[] {
  return [1, 2, 3, 4, 5, 6].map(value => {
    const size = 128;
    const { element, context: c } = canvas(size);
    c.fillStyle = 'rgba(16,12,18,0.82)';
    c.beginPath();
    c.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(243,236,220,0.35)';
    c.lineWidth = 4;
    c.stroke();
    c.fillStyle = IVORY;
    c.font = `800 ${size * 0.56}px ${bodyFont()}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(String(value), size / 2, size * 0.54);
    return texture(element);
  });
}
