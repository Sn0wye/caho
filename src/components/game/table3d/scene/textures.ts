'use client';

import {
  CanvasTexture,
  ClampToEdgeWrapping,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture
} from 'three';
import { FELT_RADIUS } from '../space';

// Every surface in the room is painted here, once, on canvases: no network
// assets. Each texture is built lazily and cached for the page's lifetime
// (the table is the whole game screen, so they are never worth disposing).

const cache = new Map<string, Texture>();

function cached(key: string, build: () => Texture): Texture {
  let texture = cache.get(key);
  if (!texture) {
    texture = build();
    cache.set(key, texture);
  }
  return texture;
}

/**
 * A small seeded PRNG, so the room looks the same on every load.
 *
 * @example
 * const random = seeded(7); random(); // 0..1
 */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(width: number, height = width) {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  const context = element.getContext('2d');
  if (!context) throw new Error('2D canvas unavailable');
  return { element, context };
}

function toTexture(
  element: HTMLCanvasElement,
  { isColor = true, isRepeat = false } = {}
): CanvasTexture {
  const texture = new CanvasTexture(element);
  texture.colorSpace = isColor ? SRGBColorSpace : NoColorSpace;
  texture.wrapS = texture.wrapT = isRepeat
    ? RepeatWrapping
    : ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  return texture;
}

function fontFamily() {
  return getComputedStyle(document.body).fontFamily || 'sans-serif';
}

// Adds per-pixel luminance jitter: the grain that keeps flat paint from
// looking like plastic.
function grain(
  context: CanvasRenderingContext2D,
  amount: number,
  random: () => number
) {
  const { width, height } = context.canvas;
  const image = context.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const jitter = (random() - 0.5) * amount;
    data[i] += jitter;
    data[i + 1] += jitter;
    data[i + 2] += jitter;
  }
  context.putImageData(image, 0, 0);
}

// A tileable normal map from a height field (0..1), via central differences
// that wrap around the edges.
function normalFromHeight(
  height: Float32Array,
  size: number,
  strength: number
): HTMLCanvasElement {
  const { element, context } = canvas(size);
  const image = context.createImageData(size, size);
  const at = (x: number, y: number) =>
    height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const length = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      image.data[i] = ((-dx / length) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((dy / length) * 0.5 + 0.5) * 255;
      image.data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return element;
}

// One wrapping box-blur pass, to soften white noise into cloth or grain.
function blur(height: Float32Array, size: number): Float32Array<ArrayBuffer> {
  const out = new Float32Array(height.length);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          sum +=
            height[((y + oy + size) % size) * size + ((x + ox + size) % size)];
        }
      }
      out[y * size + x] = sum / 9;
    }
  }
  return out;
}

/**
 * The felt's colour: emerald cloth with fibres, the printed ring and the
 * discreet CAHO lettering near the rim. Mapped onto a circle of FELT_RADIUS
 * (canvas centre = table centre).
 *
 * @example
 * <meshPhysicalMaterial map={feltColorTexture()} />
 */
export function feltColorTexture(): Texture {
  return cached('felt', () => {
    const size = 2048;
    const half = size / 2;
    const { element, context } = canvas(size);
    const random = seeded(11);
    const px = (world: number) => (world / FELT_RADIUS) * half;

    context.fillStyle = '#0a5040';
    context.fillRect(0, 0, size, size);
    // Worn lighter in the middle where hands slide, darker toward the rim.
    const wear = context.createRadialGradient(half, half, 0, half, half, half);
    wear.addColorStop(0, 'rgba(30, 120, 95, 0.16)');
    wear.addColorStop(0.75, 'rgba(0, 0, 0, 0)');
    wear.addColorStop(1, 'rgba(0, 10, 5, 0.18)');
    context.fillStyle = wear;
    context.fillRect(0, 0, size, size);

    // Loose fibres.
    context.lineCap = 'round';
    for (let i = 0; i < 14000; i++) {
      const x = random() * size;
      const y = random() * size;
      const angle = random() * Math.PI * 2;
      const length = 3 + random() * 9;
      const isLight = random() > 0.5;
      context.strokeStyle = isLight
        ? 'rgba(90, 170, 120, 0.07)'
        : 'rgba(0, 20, 10, 0.08)';
      context.lineWidth = 0.6 + random() * 0.8;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      context.stroke();
    }
    grain(context, 10, random);

    // The printed ring: two hairlines with the lettering running between.
    // Faded gold print: subtle, but it catches the eye near the rim.
    const ink = 'rgba(222, 200, 140, 0.26)';
    context.strokeStyle = ink;
    context.lineWidth = 2.5;
    for (const radius of [0.865, 0.915]) {
      context.beginPath();
      context.arc(half, half, px(radius), 0, Math.PI * 2);
      context.stroke();
    }
    context.lineWidth = 1.5;
    context.setLineDash([6, 10]);
    context.beginPath();
    context.arc(half, half, px(0.4), 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);

    const text = 'CAHO  ✦  O JOGO PARA PESSOAS HORRÍVEIS  ✦  ';
    const ringRadius = px(0.89);
    context.fillStyle = ink;
    context.font = `700 ${px(0.03)}px ${fontFamily()}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const letters = [...text.repeat(2)];
    const step = (Math.PI * 2) / letters.length;
    letters.forEach((letter, index) => {
      const angle = index * step;
      context.save();
      context.translate(
        half + Math.cos(angle) * ringRadius,
        half + Math.sin(angle) * ringRadius
      );
      context.rotate(angle + Math.PI / 2);
      context.fillText(letter, 0, 0);
      context.restore();
    });
    return toTexture(element);
  });
}

/**
 * Fine woven cloth relief for the felt, tiled many times across it.
 *
 * @example
 * const normal = feltNormalTexture(); normal.repeat.set(9, 9);
 */
export function feltNormalTexture(): Texture {
  return cached('felt-normal', () => {
    const size = 256;
    const random = seeded(5);
    let height = new Float32Array(size * size);
    for (let i = 0; i < height.length; i++) height[i] = random();
    height = blur(height, size);
    // A faint weave: the threads of the cloth.
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        height[y * size + x] +=
          0.12 *
          Math.sin((x * Math.PI * 2 * 32) / size) *
          Math.sin((y * Math.PI * 2 * 32) / size);
      }
    }
    return toTexture(normalFromHeight(height, size, 3), {
      isColor: false,
      isRepeat: true
    });
  });
}

/**
 * Pebbled leather grain for the padded rim.
 *
 * @example
 * <meshPhysicalMaterial normalMap={leatherNormalTexture()} />
 */
export function leatherNormalTexture(): Texture {
  return cached('leather-normal', () => {
    const size = 256;
    const random = seeded(3);
    let height = new Float32Array(size * size);
    // Pebbles: soft bumps scattered over the hide.
    for (let i = 0; i < 1400; i++) {
      const cx = random() * size;
      const cy = random() * size;
      const radius = 2 + random() * 3.5;
      for (let y = -6; y <= 6; y++) {
        for (let x = -6; x <= 6; x++) {
          const d = Math.hypot(x, y) / radius;
          if (d > 1) continue;
          const index =
            ((Math.floor(cy + y) + size) % size) * size +
            ((Math.floor(cx + x) + size) % size);
          height[index] = Math.max(height[index], 1 - d * d);
        }
      }
    }
    height = blur(height, size);
    return toTexture(normalFromHeight(height, size, 1.6), {
      isColor: false,
      isRepeat: true
    });
  });
}

// Long flowing grain lines, for walnut and the floor planks.
function paintGrain(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  random: () => number,
  { lines = 40, alpha = 0.12 } = {}
) {
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  for (let i = 0; i < lines; i++) {
    const baseY = y + random() * height;
    const wave = 1 + random() * 4;
    const frequency = 0.004 + random() * 0.01;
    const phase = random() * 10;
    const isDark = random() > 0.4;
    context.strokeStyle = isDark
      ? `rgba(10, 4, 2, ${alpha * (0.5 + random())})`
      : `rgba(255, 210, 160, ${alpha * 0.35 * random()})`;
    context.lineWidth = 0.5 + random() * 2;
    context.beginPath();
    for (let sx = x; sx <= x + width; sx += 8) {
      const sy = baseY + Math.sin(sx * frequency + phase) * wave;
      if (sx === x) context.moveTo(sx, sy);
      else context.lineTo(sx, sy);
    }
    context.stroke();
  }
  context.restore();
}

/**
 * Dark walnut, grain running along U.
 *
 * @example
 * <meshStandardMaterial map={walnutTexture()} />
 */
export function walnutTexture(): Texture {
  return cached('walnut', () => {
    const size = 512;
    const { element, context } = canvas(size);
    const random = seeded(17);
    context.fillStyle = '#3a2215';
    context.fillRect(0, 0, size, size);
    paintGrain(context, 0, 0, size, size, random, { lines: 120, alpha: 0.2 });
    grain(context, 8, random);
    return toTexture(element, { isRepeat: true });
  });
}

/**
 * Dark oak floor planks with staggered joints. One tile is FLOOR_TILE world
 * units square.
 *
 * @example
 * const floor = floorTexture(); floor.repeat.set(4, 4);
 */
export function floorTexture(): Texture {
  return cached('floor', () => {
    const size = 1024;
    const { element, context } = canvas(size);
    const random = seeded(23);
    const rows = 8;
    const rowHeight = size / rows;
    for (let row = 0; row < rows; row++) {
      let x = -random() * 400;
      while (x < size) {
        const length = 300 + random() * 420;
        const tone = 0.75 + random() * 0.4;
        const r = Math.round(46 * tone);
        const g = Math.round(30 * tone);
        const b = Math.round(22 * tone);
        const y = row * rowHeight;
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.fillRect(x, y, length, rowHeight);
        paintGrain(context, x, y, length, rowHeight, random, {
          lines: 14,
          alpha: 0.22
        });
        // Seams.
        context.fillStyle = 'rgba(5, 3, 2, 0.9)';
        context.fillRect(x, y, 3, rowHeight);
        context.fillRect(x, y, length, 2);
        // Wrap planks that overflow the tile so it repeats seamlessly.
        if (x + length > size) {
          context.fillStyle = `rgb(${r}, ${g}, ${b})`;
          context.fillRect(x - size, y, length, rowHeight);
          context.fillStyle = 'rgba(5, 3, 2, 0.9)';
          context.fillRect(x - size, y, 3, rowHeight);
        }
        x += length;
      }
    }
    grain(context, 10, random);
    return toTexture(element, { isRepeat: true });
  });
}

/**
 * The round rug under the table: plum pile, gold and teal border bands.
 * Mapped onto a circle (canvas centre = rug centre).
 *
 * @example
 * <meshStandardMaterial map={rugTexture()} />
 */
export function rugTexture(): Texture {
  return cached('rug', () => {
    const size = 1024;
    const half = size / 2;
    const { element, context } = canvas(size);
    const random = seeded(31);
    context.fillStyle = '#2b0f1f';
    context.fillRect(0, 0, size, size);

    const ring = (radius: number, width: number, color: string) => {
      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.arc(half, half, radius * half, 0, Math.PI * 2);
      context.stroke();
    };
    ring(0.97, 24, '#1a0913');
    ring(0.92, 10, '#8a6a34');
    ring(0.86, 34, '#123c3c');
    ring(0.8, 6, '#8a6a34');
    ring(0.5, 4, '#5a2a3c');

    // A band of diamonds between the border lines.
    context.fillStyle = '#7a5530';
    const count = 72;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      context.save();
      context.translate(
        half + Math.cos(angle) * 0.86 * half,
        half + Math.sin(angle) * 0.86 * half
      );
      context.rotate(angle);
      context.beginPath();
      context.moveTo(-11, 0);
      context.lineTo(0, -11);
      context.lineTo(11, 0);
      context.lineTo(0, 11);
      context.closePath();
      context.fill();
      context.restore();
    }
    // A rosette in the middle (under the table, mostly in shadow).
    for (let i = 0; i < 12; i++) {
      context.save();
      context.translate(half, half);
      context.rotate((i / 12) * Math.PI * 2);
      context.fillStyle = 'rgba(120, 50, 70, 0.35)';
      context.beginPath();
      context.ellipse(
        0,
        -0.25 * half,
        0.05 * half,
        0.2 * half,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
      context.restore();
    }
    grain(context, 26, random);
    return toTexture(element);
  });
}

/**
 * The walls: dark plum wallpaper with a faint pattern over walnut
 * wainscoting. One tile is WALL_TILE wide and the full wall height tall;
 * `wainscot` is the fraction of the height the panels cover.
 *
 * @example
 * const wall = wallTexture(0.3); wall.repeat.set(5, 1);
 */
export function wallTexture(wainscot: number): Texture {
  return cached(`wall-${wainscot}`, () => {
    const width = 512;
    const height = 1024;
    const { element, context } = canvas(width, height);
    const random = seeded(41);
    const panelTop = height * (1 - wainscot);

    context.fillStyle = '#2f2230';
    context.fillRect(0, 0, width, panelTop);
    // Damask-ish diamonds, barely there.
    context.strokeStyle = 'rgba(170, 120, 150, 0.1)';
    context.lineWidth = 2;
    for (let y = -64; y < panelTop; y += 128) {
      for (let x = 0; x <= width; x += 128) {
        const offset = (y / 128) % 2 === 0 ? 0 : 64;
        context.beginPath();
        context.moveTo(x + offset, y);
        context.lineTo(x + offset + 32, y + 64);
        context.lineTo(x + offset, y + 128);
        context.lineTo(x + offset - 32, y + 64);
        context.closePath();
        context.stroke();
      }
    }

    // Wainscot: walnut with two raised panels, a rail on top, skirting below.
    context.fillStyle = '#3d2614';
    context.fillRect(0, panelTop, width, height - panelTop);
    paintGrain(context, 0, panelTop, width, height - panelTop, random, {
      lines: 60,
      alpha: 0.18
    });
    const inset = 28;
    const skirting = 40;
    const panelWidth = width / 2;
    for (let i = 0; i < 2; i++) {
      const x = i * panelWidth + inset;
      const y = panelTop + 36;
      const w = panelWidth - inset * 2;
      const h = height - panelTop - 36 - skirting - inset;
      context.fillStyle = 'rgba(255, 200, 150, 0.06)';
      context.fillRect(x, y, w, 4);
      context.fillRect(x, y, 4, h);
      context.fillStyle = 'rgba(0, 0, 0, 0.45)';
      context.fillRect(x, y + h - 4, w, 4);
      context.fillRect(x + w - 4, y, 4, h);
    }
    context.fillStyle = '#3a2215';
    context.fillRect(0, panelTop, width, 14);
    context.fillStyle = 'rgba(255, 210, 160, 0.12)';
    context.fillRect(0, panelTop, width, 3);
    context.fillStyle = '#140a06';
    context.fillRect(0, height - skirting, width, skirting);
    grain(context, 8, random);
    return toTexture(element, { isRepeat: true });
  });
}

/**
 * A soft round glow, white in the middle: decals for light pools on walls.
 *
 * @example
 * <meshBasicMaterial map={glowTexture()} blending={AdditiveBlending} />
 */
export function glowTexture(): Texture {
  return cached('glow', () => {
    const size = 256;
    const half = size / 2;
    const { element, context } = canvas(size);
    const gradient = context.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    return toTexture(element);
  });
}

/**
 * The neon sign's tagline, glowing script on transparent black. Used with
 * additive blending and an HDR colour.
 *
 * @example
 * <meshBasicMaterial map={taglineTexture()} transparent />
 */
export function taglineTexture(): Texture {
  return cached('tagline', () => {
    const width = 1024;
    const height = 128;
    const { element, context } = canvas(width, height);
    context.font = `italic 500 60px ${fontFamily()}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineJoin = 'round';
    // Glow pass, then the tube's white-hot core.
    context.shadowColor = 'rgba(255, 255, 255, 0.9)';
    context.shadowBlur = 18;
    context.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    context.lineWidth = 4;
    context.strokeText('o jogo para pessoas horríveis', width / 2, height / 2);
    context.shadowBlur = 0;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    context.strokeText('o jogo para pessoas horríveis', width / 2, height / 2);
    return toTexture(element);
  });
}

type PosterSpec = {
  background: string;
  ink: string;
  accent: string;
  lines: string[];
};

const POSTERS: PosterSpec[] = [
  {
    background: '#5b1626',
    ink: '#f3e6cf',
    accent: '#111014',
    lines: ['TORNEIO DE', 'PESSOAS', 'HORRÍVEIS', 'SEXTA · 23H']
  },
  {
    background: '#e7dcc4',
    ink: '#1a1418',
    accent: '#1f6f66',
    lines: ['É PROIBIDO', 'TER BOM', 'SENSO', 'DESDE SEMPRE']
  },
  {
    background: '#1d2a4a',
    ink: '#f2c94c',
    accent: '#f3e6cf',
    lines: ['NÃO', 'CONTE', 'PRA SUA', 'MÃE']
  }
];

/**
 * A framed poster for the walls: a card graphic and a few words in the
 * game's voice. `index` picks one of a few designs.
 *
 * @example
 * <meshStandardMaterial map={posterTexture(0)} />
 */
export function posterTexture(index: number): Texture {
  const spec = POSTERS[index % POSTERS.length];
  return cached(`poster-${index % POSTERS.length}`, () => {
    const width = 512;
    const height = 768;
    const { element, context } = canvas(width, height);
    const random = seeded(50 + index);
    context.fillStyle = spec.background;
    context.fillRect(0, 0, width, height);

    // Two tilted cards, one black one white, like a fanned hand.
    const card = (angle: number, fill: string, text: string) => {
      context.save();
      context.translate(width / 2, 300);
      context.rotate(angle);
      context.fillStyle = fill;
      context.beginPath();
      context.roundRect(-90, -130, 180, 260, 14);
      context.fill();
      context.fillStyle = fill === '#ffffff' ? '#111' : '#fff';
      context.font = `700 22px ${fontFamily()}`;
      context.fillText(text, -70, -90);
      context.restore();
    };
    card(-0.22, spec.accent, '____?');
    card(0.16, '#ffffff', 'Eu.');

    context.fillStyle = spec.ink;
    context.textAlign = 'center';
    spec.lines.forEach((line, i) => {
      const isLast = i === spec.lines.length - 1;
      context.font = `${isLast ? 600 : 900} ${isLast ? 30 : 58}px ${fontFamily()}`;
      context.fillText(line, width / 2, 520 + i * 60 + (isLast ? 14 : 0));
    });
    // Aged paper.
    const age = context.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.2,
      width / 2,
      height / 2,
      height * 0.7
    );
    age.addColorStop(0, 'rgba(0, 0, 0, 0)');
    age.addColorStop(1, 'rgba(30, 15, 5, 0.45)');
    context.fillStyle = age;
    context.fillRect(0, 0, width, height);
    grain(context, 22, random);
    return toTexture(element);
  });
}

const MENU: [item: string, price: string][] = [
  ['CAIPIRINHA', '12'],
  ['CERVEJA', '8'],
  ['PINGA', '5'],
  ['DIGNIDADE', 'EM FALTA'],
  ['FIADO', 'SÓ AMANHÃ']
];

/**
 * The bar's chalkboard: today's prices, in the game's voice.
 *
 * @example
 * <meshStandardMaterial map={chalkboardTexture()} />
 */
export function chalkboardTexture(): Texture {
  return cached('chalkboard', () => {
    const width = 768;
    const height = 560;
    const { element, context } = canvas(width, height);
    const random = seeded(61);
    context.fillStyle = '#1c2a26';
    context.fillRect(0, 0, width, height);
    // Wiped-off chalk.
    for (let i = 0; i < 14; i++) {
      context.fillStyle = `rgba(255, 255, 255, ${0.015 + random() * 0.025})`;
      context.beginPath();
      context.ellipse(
        random() * width,
        random() * height,
        80 + random() * 160,
        20 + random() * 40,
        random() * 0.6 - 0.3,
        0,
        Math.PI * 2
      );
      context.fill();
    }
    context.textBaseline = 'middle';
    context.fillStyle = '#ffd866';
    context.textAlign = 'center';
    context.font = `900 64px ${fontFamily()}`;
    context.fillText('HOJE TEM', width / 2, 70);
    context.fillStyle = '#ff7eb6';
    context.fillRect(width / 2 - 150, 112, 300, 5);
    context.font = `700 44px ${fontFamily()}`;
    MENU.forEach(([item, price], index) => {
      const y = 176 + index * 76;
      context.fillStyle = '#f4f1e8';
      context.textAlign = 'left';
      context.fillText(item, 48, y);
      context.fillStyle = index > 2 ? '#ff7eb6' : '#8fe3c0';
      context.textAlign = 'right';
      context.fillText(index > 2 ? price : `R$ ${price}`, width - 48, y);
    });
    grain(context, 14, random);
    return toTexture(element);
  });
}

const JUKEBOX_TUBES = ['#ff9a3c', '#ff4fa3', '#ffd84a', '#4fe0d0'];

/**
 * The jukebox's front, self-lit: an arch of coloured tubes around a title
 * window, the record rows and a speaker grille. Transparent outside the arch.
 *
 * @example
 * <meshBasicMaterial map={jukeboxTexture()} alphaTest={0.5} />
 */
export function jukeboxTexture(): Texture {
  return cached('jukebox', () => {
    const width = 384;
    const height = 720;
    const { element, context } = canvas(width, height);
    const half = width / 2;
    const arch = (inset: number) => {
      context.beginPath();
      context.moveTo(inset, height - inset);
      context.lineTo(inset, half);
      context.arc(half, half, half - inset, Math.PI, 0);
      context.lineTo(width - inset, height - inset);
      context.closePath();
    };
    arch(0);
    context.fillStyle = '#3a2014';
    context.fill();
    // The tubes: nested arches, one colour each.
    JUKEBOX_TUBES.forEach((color, index) => {
      arch(16 + index * 15);
      context.strokeStyle = color;
      context.lineWidth = 10;
      context.stroke();
    });
    arch(78);
    context.fillStyle = '#170d0a';
    context.fill();

    context.fillStyle = '#f6e9c8';
    context.beginPath();
    context.roundRect(100, 150, width - 200, 96, 10);
    context.fill();
    context.fillStyle = '#7a1626';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `900 34px ${fontFamily()}`;
    context.fillText('TOCA', half, 180);
    context.fillText('RAUL!', half, 218);

    // Record rows, a few of them lit.
    for (let row = 0; row < 5; row++) {
      for (let column = 0; column < 2; column++) {
        const isLit = (row * 2 + column) % 3 === 0;
        context.fillStyle = isLit ? '#ffd84a' : '#c9b48a';
        context.fillRect(104 + column * 92, 272 + row * 26, 84, 18);
      }
    }
    // Speaker grille.
    context.fillStyle = '#c99a4e';
    context.beginPath();
    context.roundRect(96, 430, width - 192, 240, 14);
    context.fill();
    context.fillStyle = '#2a1810';
    for (let x = 112; x < width - 104; x += 14) {
      context.fillRect(x, 444, 6, 212);
    }
    return toTexture(element);
  });
}

const DART_RING: [radius: number, even: string, odd: string][] = [
  [1, '#16120f', '#16120f'],
  [0.82, '#c8321e', '#2f8a4a'],
  [0.76, '#1a1512', '#ecdcb4'],
  [0.5, '#c8321e', '#2f8a4a'],
  [0.44, '#1a1512', '#ecdcb4']
];

/**
 * A dartboard, face on.
 *
 * @example
 * <meshStandardMaterial map={dartboardTexture()} />
 */
export function dartboardTexture(): Texture {
  return cached('dartboard', () => {
    const size = 512;
    const half = size / 2;
    const { element, context } = canvas(size);
    const slice = Math.PI / 10;
    for (const [radius, even, odd] of DART_RING) {
      for (let i = 0; i < 20; i++) {
        context.fillStyle = i % 2 === 0 ? even : odd;
        context.beginPath();
        context.moveTo(half, half);
        context.arc(
          half,
          half,
          half * radius,
          (i - 0.5) * slice,
          (i + 0.5) * slice
        );
        context.closePath();
        context.fill();
      }
    }
    context.fillStyle = '#2f8a4a';
    context.beginPath();
    context.arc(half, half, half * 0.09, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#c8321e';
    context.beginPath();
    context.arc(half, half, half * 0.04, 0, Math.PI * 2);
    context.fill();
    return toTexture(element);
  });
}

/**
 * The lit "SAÍDA" sign over the door.
 *
 * @example
 * <meshBasicMaterial map={exitTexture()} />
 */
export function exitTexture(): Texture {
  return cached('exit', () => {
    const { element, context } = canvas(256, 96);
    context.fillStyle = '#1f9d55';
    context.fillRect(0, 0, 256, 96);
    context.fillStyle = '#eafff2';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `900 60px ${fontFamily()}`;
    context.fillText('SAÍDA', 128, 52);
    return toTexture(element);
  });
}
