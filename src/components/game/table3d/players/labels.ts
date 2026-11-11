'use client';

import { useEffect, useState } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { getUsernameInitials } from '@/utils/name';

// Every label in this layer is drawn on a canvas: no CDN fonts. The app font
// (Geist Sans) is already loaded on the page, so canvas text can use it.

// World units per logical canvas pixel, for planes that carry these textures.
export const LABEL_PX = 0.0011;
// Canvases are drawn at this many device pixels per logical pixel.
const DENSITY = 3;

/**
 * True once the page's web fonts have loaded, so labels redraw in Geist
 * instead of the fallback.
 *
 * @example
 * const isFontReady = useFontsReady();
 * const plate = useMemo(() => drawNameplate(...), [isFontReady]);
 */
export function useFontsReady(): boolean {
  const [isReady, setReady] = useState(
    () => typeof document !== 'undefined' && document.fonts.status === 'loaded'
  );
  useEffect(() => {
    if (isReady) return;
    let isCurrent = true;
    void document.fonts.ready.then(() => isCurrent && setReady(true));
    return () => {
      isCurrent = false;
    };
  }, [isReady]);
  return isReady;
}

export type Label = {
  texture: CanvasTexture;
  width: number;
  height: number;
  // Nameplates only: the pill's width.
  rowWidth?: number;
};

// Canvas px of the nameplate name font and its cap height (Geist ~0.72 em):
// the pawn scales the plate so these land at a fixed size on screen.
export const PLATE_NAME_PX = 30;
export const PLATE_CAP_PX = PLATE_NAME_PX * 0.72;
// Canvas px under the plate's pill, so its bottom edge is the anchor.
export const PLATE_PAD = 4;
// The pill's height, for badges that sit on its corner.
export const PLATE_ROW = 46;

function bodyFont(): string {
  if (typeof document === 'undefined') return 'sans-serif';
  return getComputedStyle(document.body).fontFamily || 'sans-serif';
}

function canvas(width: number, height: number) {
  const element = document.createElement('canvas');
  element.width = Math.ceil(width * DENSITY);
  element.height = Math.ceil(height * DENSITY);
  const context = element.getContext('2d');
  if (!context) throw new Error('2d canvas unavailable');
  context.scale(DENSITY, DENSITY);
  return { element, context };
}

function texture(element: HTMLCanvasElement): CanvasTexture {
  const map = new CanvasTexture(element);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 4;
  return map;
}

function pill(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  context.beginPath();
  context.roundRect(x, y, width, height, height / 2);
}

function star(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  context.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    context.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  context.closePath();
}

export type NameplateTag = 'juiz' | 'caiu' | 'campeão' | null;

const TAG_STYLES: Record<Exclude<NameplateTag, null>, [string, string]> = {
  juiz: ['#e8c25a', '#1c1405'],
  campeão: ['#e8c25a', '#1c1405'],
  caiu: ['#52525b', '#e4e4e7']
};

/**
 * A Player's nameplate: name, score chip, a star for the host and an optional
 * tag above it. Anchor the plane at its bottom centre.
 *
 * @example
 * const plate = drawNameplate({ name: 'Ana', score: 2, color, isHost: true, tag: 'juiz' });
 */
export function drawNameplate({
  name,
  score,
  color,
  isHost,
  tag
}: {
  name: string;
  score: number;
  color: string;
  isHost: boolean;
  tag: NameplateTag;
}): Label {
  const family = bodyFont();
  const nameFont = `700 ${PLATE_NAME_PX}px ${family}`;
  const scoreFont = `800 24px ${family}`;
  const tagFont = `800 20px ${family}`;
  const measure = canvas(1, 1).context;
  measure.font = nameFont;
  const shown = name.length > 16 ? `${name.slice(0, 15)}…` : name;
  const nameWidth = measure.measureText(shown).width;
  measure.font = tagFont;
  const tagText = tag?.toUpperCase() ?? '';
  const tagWidth = tag ? measure.measureText(tagText).width + 24 : 0;

  const plateHeight = PLATE_ROW;
  const tagHeight = tag ? 30 : 0;
  const gap = tag ? 6 : 0;
  const starWidth = isHost ? 26 : 0;
  const chip = 38;
  const plateWidth = 18 + starWidth + nameWidth + 12 + chip + 6;
  const width = Math.max(plateWidth, tagWidth) + 8;
  const height = plateHeight + tagHeight + gap + PLATE_PAD + 4;
  const { element, context } = canvas(width, height);

  if (tag) {
    const [background, ink] = TAG_STYLES[tag];
    context.fillStyle = background;
    pill(context, (width - tagWidth) / 2, 4, tagWidth, tagHeight);
    context.fill();
    context.fillStyle = ink;
    context.font = tagFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(tagText, width / 2, 4 + tagHeight / 2 + 1);
  }

  const top = 4 + tagHeight + gap;
  const left = (width - plateWidth) / 2;
  context.fillStyle = 'rgba(10, 9, 12, 0.86)';
  pill(context, left, top, plateWidth, plateHeight);
  context.fill();
  context.strokeStyle = color;
  context.globalAlpha = 0.55;
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 1;

  let x = left + 18;
  const middle = top + plateHeight / 2;
  if (isHost) {
    context.fillStyle = '#f5cd5b';
    star(context, x + 9, middle, 10);
    context.fill();
    x += starWidth;
  }
  context.fillStyle = '#fafafa';
  context.font = nameFont;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(shown, x, middle + 1);
  x += nameWidth + 12;

  context.fillStyle = color;
  context.beginPath();
  context.arc(x + chip / 2, middle, chip / 2, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#0a0a0c';
  context.font = scoreFont;
  context.textAlign = 'center';
  context.fillText(String(score), x + chip / 2, middle + 1);

  return { texture: texture(element), width, height, rowWidth: plateWidth };
}

/**
 * The round medallion a pawn wears: the avatar when it loads (CORS allowing),
 * the Player's initials on their seat colour until then, or for good.
 *
 * @example
 * const medallion = drawMedallion('Ana Banana', '#e5c443', avatarUrl);
 */
export function drawMedallion(
  name: string,
  color: string,
  avatarUrl: string | null
): CanvasTexture {
  const size = 128;
  const { element, context } = canvas(size, size);
  const map = texture(element);

  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
  // A soft top light so the coin reads as round.
  const shine = context.createRadialGradient(44, 34, 4, 64, 64, 90);
  shine.addColorStop(0, 'rgba(255,255,255,0.35)');
  shine.addColorStop(1, 'rgba(0,0,0,0.18)');
  context.fillStyle = shine;
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#121014';
  context.font = `800 54px ${bodyFont()}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(getUsernameInitials(name) || '?', size / 2, size / 2 + 3);

  if (avatarUrl) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      context.save();
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.clip();
      context.drawImage(image, 0, 0, size, size);
      context.restore();
      map.needsUpdate = true;
    };
    image.src = avatarUrl;
  }
  return map;
}

export type BadgeKind = 'check' | 'wait';

const badges = new Map<BadgeKind, CanvasTexture>();

/**
 * A round status badge (green check, grey "waiting" dots), shared by every
 * pawn.
 *
 * @example
 * <meshBasicMaterial map={badge('check')} transparent />
 */
export function badge(kind: BadgeKind): CanvasTexture {
  const cached = badges.get(kind);
  if (cached) return cached;
  const size = 64;
  const { element, context } = canvas(size, size);
  context.fillStyle = kind === 'check' ? '#34d399' : '#3f3f46';
  context.beginPath();
  context.arc(32, 32, 29, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = 'rgba(10,9,12,0.9)';
  context.stroke();
  if (kind === 'check') {
    context.strokeStyle = '#052e1c';
    context.lineWidth = 7;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(19, 33);
    context.lineTo(28, 42);
    context.lineTo(45, 23);
    context.stroke();
  } else {
    context.fillStyle = '#d4d4d8';
    for (const x of [20, 32, 44]) {
      context.beginPath();
      context.arc(x, 33, 4.2, 0, Math.PI * 2);
      context.fill();
    }
  }
  const map = texture(element);
  badges.set(kind, map);
  return map;
}

let glow: CanvasTexture | null = null;

/**
 * A white radial falloff, tinted by the material colour: soft light pools.
 *
 * @example
 * <meshBasicMaterial map={glowTexture()} color={color} blending={AdditiveBlending} />
 */
export function glowTexture(): CanvasTexture {
  if (glow) return glow;
  const size = 64;
  const { element, context } = canvas(size, size);
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  glow = texture(element);
  return glow;
}

/**
 * The small name tag that rides along a 3D cursor.
 *
 * @example
 * const tag = drawCursorTag('Ana', '#e5c443');
 */
export function drawCursorTag(name: string, color: string): Label {
  const font = `700 22px ${bodyFont()}`;
  const measure = canvas(1, 1).context;
  measure.font = font;
  const shown = name.length > 14 ? `${name.slice(0, 13)}…` : name;
  const width = measure.measureText(shown).width + 24;
  const height = 32;
  const { element, context } = canvas(width + 4, height + 4);
  context.fillStyle = color;
  pill(context, 2, 2, width, height);
  context.fill();
  context.fillStyle = '#0a0a0c';
  context.font = font;
  context.textBaseline = 'middle';
  context.fillText(shown, 14, 2 + height / 2 + 1);
  return { texture: texture(element), width: width + 4, height: height + 4 };
}
