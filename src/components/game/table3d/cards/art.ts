'use client';

import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace
} from 'three';

// Everything drawn on a card: canvas textures (face, back, deck sides, glow)
// and the materials wrapping them, cached and shared between meshes.

const WIDTH = 512;
const HEIGHT = 768;
const PAD = 46;
const INK = '#09090b';
const PAPER = '#ffffff';
const NIGHT = '#0b0b0d';
const BLANK = '___';

export type CardKind = 'white' | 'black';

// What a card face shows. Answers fill the Black Card's blanks in order.
export type FaceSpec =
  | { kind: 'white'; text: string }
  | { kind: 'black'; text: string; answers: string[] }
  | { kind: 'white-blank' }
  | { kind: 'black-blank' }
  // A card nobody here may read: its face shows the back's design too, so a
  // neighbour's fan seen from the side gives nothing away.
  | { kind: 'hidden'; card: CardKind };

/**
 * A stable cache key for a face.
 *
 * @example
 * faceKey({ kind: 'white', text: 'Pão de queijo.' }); // 'w:Pão de queijo.'
 */
export function faceKey(spec: FaceSpec): string {
  switch (spec.kind) {
    case 'white':
      return `w:${spec.text}`;
    case 'black':
      return `b:${spec.text}\u0000${spec.answers.join('\u0000')}`;
    case 'hidden':
      return `hidden:${spec.card}`;
    default:
      return spec.kind;
  }
}

// --- Fonts -----------------------------------------------------------------

let fontFamily = 'system-ui, sans-serif';
let isFontReady = false;
const redraws = new Set<() => void>();

function loadFont() {
  if (typeof document === 'undefined' || isFontReady) return;
  const style = getComputedStyle(document.body);
  // Geist is only exposed as a variable on the body (the page's own stack
  // may not resolve it), so ask for it by name first.
  const geist = style.getPropertyValue('--font-geist-sans').trim();
  const family = [geist, style.fontFamily].filter(Boolean).join(', ');
  if (family) fontFamily = family;
  isFontReady = true;
  void document.fonts
    .load(`800 48px ${fontFamily}`)
    .then(() => document.fonts.ready)
    .then(() => {
      for (const redraw of redraws) redraw();
    })
    .catch(() => undefined);
}

// Card text: heavy and tightly tracked, like printed CAH cards.
function setFont(ctx: CanvasRenderingContext2D, size: number, weight = 800) {
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  ctx.letterSpacing = weight >= 800 ? `${(-size * 0.025).toFixed(2)}px` : '0px';
}

// --- Textures --------------------------------------------------------------

let anisotropy = 1;
const textures = new Set<CanvasTexture>();

/**
 * Called once with the renderer's limit so card text stays crisp at grazing
 * angles (cards lying on the felt are seen almost edge on).
 *
 * @example
 * setAnisotropy(gl.capabilities.getMaxAnisotropy());
 */
export function setAnisotropy(value: number) {
  anisotropy = value;
  // Textures drawn before the renderer was known (the decks) catch up.
  for (const texture of textures) {
    if (texture.anisotropy === value) continue;
    texture.anisotropy = value;
    texture.needsUpdate = true;
  }
}

function canvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void
): { texture: CanvasTexture; dispose: () => void } {
  loadFont();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  textures.add(texture);
  const redraw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    draw(ctx);
    texture.needsUpdate = true;
  };
  redraw();
  redraws.add(redraw);
  return {
    texture,
    dispose: () => {
      redraws.delete(redraw);
      textures.delete(texture);
      texture.dispose();
    }
  };
}

// --- Rich text -------------------------------------------------------------

type RunKind = 'plain' | 'answer' | 'blank';
type Run = { text: string; kind: RunKind; isBlock?: boolean };
type Token = {
  text: string;
  kind: RunKind;
  width: number;
  isSpace: boolean;
  // Inset of the text inside an answer's highlight.
  padLeft: number;
};
type Placed = Token & { x: number };
type Layout = { lines: Placed[][]; size: number; lineHeight: number };

// The DOM card's blank: a short underline.
const blankWidth = (size: number) => size * 3.4;
const answerPad = (size: number) => size * 0.2;

// Splits a word too long for a line into hyphenated pieces that fit.
function hyphenate(
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number
): string[] {
  const pieces: string[] = [];
  let rest = word;
  while (ctx.measureText(rest).width > maxWidth && rest.length > 4) {
    let cut = rest.length - 2;
    while (
      cut > 2 &&
      ctx.measureText(`${rest.slice(0, cut)}-`).width > maxWidth
    )
      cut--;
    pieces.push(`${rest.slice(0, cut)}-`);
    rest = rest.slice(cut);
  }
  return [...pieces, rest];
}

function tokenize(
  ctx: CanvasRenderingContext2D,
  runs: Run[],
  size: number,
  breakWidth: number | null
) {
  setFont(ctx, size);
  const out: (Token | 'break')[] = [];
  for (const run of runs) {
    if (run.isBlock && out.length > 0) out.push('break');
    if (run.kind === 'blank') {
      out.push({
        text: '',
        kind: 'blank',
        width: blankWidth(size),
        isSpace: false,
        padLeft: 0
      });
      continue;
    }
    // Hyphenated words may break after the hyphen ("Desvanecendo-|se").
    const parts = run.text
      .split(/(\s+)/)
      .flatMap(part => (/\s/.test(part) ? [part] : part.split(/(?<=-)(?=.)/)))
      .flatMap(part =>
        breakWidth === null || /\s/.test(part)
          ? [part]
          : hyphenate(ctx, part, breakWidth)
      )
      .filter(part => part.length > 0);
    parts.forEach((part, index) => {
      const isSpace = /^\s+$/.test(part);
      let width = ctx.measureText(isSpace ? ' ' : part).width;
      let padLeft = 0;
      // Answers get a little padding inside their highlight at both ends.
      if (run.kind === 'answer' && !isSpace) {
        if (index === 0) padLeft = answerPad(size);
        if (index === parts.length - 1) width += answerPad(size);
      }
      width += padLeft;
      out.push({ text: part, kind: run.kind, width, isSpace, padLeft });
    });
  }
  return out;
}

function layoutRuns(
  ctx: CanvasRenderingContext2D,
  runs: Run[],
  maxWidth: number,
  size: number,
  canHyphenate = false
): Layout & { height: number; widest: number } {
  const lineHeight = size * 1.12;
  const lines: Placed[][] = [[]];
  let x = 0;
  let pendingSpace = 0;
  let widest = 0;
  const breakWidth = canHyphenate ? maxWidth * 0.94 : null;
  for (const token of tokenize(ctx, runs, size, breakWidth)) {
    if (token === 'break') {
      lines.push([]);
      x = 0;
      pendingSpace = 0;
      continue;
    }
    if (token.isSpace) {
      if (x > 0) pendingSpace = token.width;
      continue;
    }
    widest = Math.max(widest, token.width);
    if (x > 0 && x + pendingSpace + token.width > maxWidth) {
      lines.push([]);
      x = 0;
      pendingSpace = 0;
    }
    const line = lines[lines.length - 1];
    x += pendingSpace;
    if (pendingSpace > 0 && line.length > 0) {
      // Keep the space as a token so answer highlights run across it.
      const previous = line[line.length - 1];
      line.push({
        text: ' ',
        kind: previous.kind === token.kind ? token.kind : 'plain',
        width: pendingSpace,
        isSpace: true,
        padLeft: 0,
        x: x - pendingSpace
      });
    }
    line.push({ ...token, x });
    x += token.width;
    pendingSpace = 0;
  }
  return {
    lines,
    size,
    lineHeight,
    height: lines.length * lineHeight,
    widest
  };
}

// Shrinks the text until it fits the box, like the DOM card's size steps.
// One long word shouldn't shrink a whole card to fine print: below 55% of
// the full size it gets hyphenated instead.
function fitRuns(
  ctx: CanvasRenderingContext2D,
  runs: Run[],
  box: { width: number; height: number },
  maxSize: number,
  minSize: number
): Layout {
  const floor = maxSize * 0.55;
  let layout = layoutRuns(ctx, runs, box.width, maxSize);
  for (let size = maxSize; size >= minSize; size -= 2) {
    layout = layoutRuns(ctx, runs, box.width, size, size < floor);
    if (layout.height <= box.height && layout.widest <= box.width) break;
    if (size >= floor && size - 2 < floor) {
      // Try the floor size with hyphens before going smaller.
      layout = layoutRuns(ctx, runs, box.width, size, true);
      if (layout.height <= box.height && layout.widest <= box.width) break;
    }
  }
  return layout;
}

function drawLayout(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  left: number,
  top: number,
  colors: { text: string; answerText: string; answerFill: string }
) {
  const { size, lineHeight, lines } = layout;
  setFont(ctx, size);
  ctx.textBaseline = 'alphabetic';
  lines.forEach((line, row) => {
    const baseline = top + row * lineHeight + size * 0.95;
    // Highlights first, merged across each line's run of answer words.
    let start: number | null = null;
    let end = 0;
    const flush = () => {
      if (start === null) return;
      ctx.fillStyle = colors.answerFill;
      ctx.beginPath();
      ctx.roundRect(
        left + start,
        baseline - size * 0.9,
        end - start,
        size * 1.16,
        size * 0.12
      );
      ctx.fill();
      start = null;
    };
    for (const token of line) {
      if (token.kind !== 'answer') {
        flush();
      } else if (!token.isSpace) {
        start ??= token.x;
        end = token.x + token.width;
      }
    }
    flush();

    for (const token of line) {
      if (token.isSpace) continue;
      if (token.kind === 'blank') {
        ctx.fillStyle = colors.text;
        ctx.fillRect(
          left + token.x + size * 0.12,
          baseline + size * 0.08,
          token.width - size * 0.24,
          Math.max(3, size * 0.075)
        );
        continue;
      }
      ctx.fillStyle = token.kind === 'answer' ? colors.answerText : colors.text;
      ctx.fillText(token.text, left + token.x + token.padLeft, baseline);
    }
  });
}

// The Black Card's sentence with answers in its blanks, like the DOM card.
function blackRuns(text: string, answers: string[]): Run[] {
  if (!text.includes(BLANK)) {
    return [
      { text, kind: 'plain' },
      ...answers.map(answer => ({
        text: answer,
        kind: 'answer' as const,
        isBlock: true
      }))
    ];
  }
  const segments = text.split(BLANK);
  const runs: Run[] = [];
  segments.forEach((segment, index) => {
    if (segment) runs.push({ text: segment, kind: 'plain' });
    if (index === segments.length - 1) return;
    const answer = answers[index];
    if (!answer) {
      runs.push({ text: '', kind: 'blank' });
      return;
    }
    // "Pão de queijo." in "___." would read "queijo..": drop the answer's
    // full stop when the sentence brings its own punctuation.
    const following = segments[index + 1] ?? '';
    const trimmed = /^[.!?,;:]/.test(following)
      ? answer.replace(/[.!?]+$/, '')
      : answer;
    runs.push({ text: trimmed, kind: 'answer' });
  });
  return runs;
}

// --- Logo ------------------------------------------------------------------

const LOGO_BACK =
  'M11.549 62.623a4 4 0 012.027-5.281l80.392-35.793a4 4 0 015.281 2.027l52.062 116.934a4 4 0 01-2.027 5.281l-80.392 35.793a4 4 0 01-5.281-2.027L11.549 62.623z';
const LOGO_BACK_RING =
  'M11.136 51.86l80.391-35.793c5.046-2.246 10.957.023 13.203 5.069l52.063 116.933c2.246 5.046-.023 10.957-5.068 13.203l-80.392 35.793c-5.046 2.246-10.957-.023-13.203-5.068L6.067 65.063c-2.246-5.045.023-10.956 5.069-13.203zm2.44 5.482a4 4 0 00-2.027 5.28L63.61 179.557a4 4 0 005.281 2.028l80.392-35.793a4 4 0 002.027-5.281L99.249 23.576a4 4 0 00-5.281-2.027L13.576 57.342z';
const LOGO_FRONT =
  'M96.938 18a4 4 0 014-4h88a4 4 0 014 4v128a4 4 0 01-4 4h-88a4 4 0 01-4-4V18z';
const LOGO_FRONT_RING =
  'M100.938 8h88c5.523 0 10 4.477 10 10v128c0 5.523-4.477 10-10 10h-88c-5.523 0-10-4.477-10-10V18c0-5.523 4.477-10 10-10zm0 6a4 4 0 00-4 4v128a4 4 0 004 4h88a4 4 0 004-4V18a4 4 0 00-4-4h-88z';

// The brand mark (two overlapping cards), `size` px wide.
function drawLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  ink: string,
  paper: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 200, size / 200);
  ctx.fillStyle = ink;
  ctx.fill(new Path2D(LOGO_BACK));
  ctx.fill(new Path2D(LOGO_BACK_RING), 'evenodd');
  ctx.fillStyle = paper;
  ctx.fill(new Path2D(LOGO_FRONT));
  ctx.fillStyle = ink;
  ctx.fill(new Path2D(LOGO_FRONT_RING), 'evenodd');
  ctx.restore();
}

// Like the DOM CardFooter: the mark and "CAHO", bottom left.
function drawFooter(ctx: CanvasRenderingContext2D, ink: string, paper: string) {
  const size = 46;
  const y = HEIGHT - PAD - size;
  drawLogo(ctx, PAD - 4, y, size, ink, paper);
  ctx.fillStyle = ink;
  setFont(ctx, 30, 700);
  ctx.textBaseline = 'middle';
  ctx.fillText('CAHO', PAD + size + 8, y + size / 2 + 2);
}

// --- Faces and backs -------------------------------------------------------

const textBox = { width: WIDTH - PAD * 2, height: HEIGHT - PAD * 2 - 96 };

function drawFace(ctx: CanvasRenderingContext2D, spec: FaceSpec) {
  if (spec.kind === 'hidden') {
    drawBack(ctx, spec.card);
    return;
  }
  const isBlack = spec.kind === 'black' || spec.kind === 'black-blank';
  const ink = isBlack ? PAPER : INK;
  const paper = isBlack ? NIGHT : PAPER;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (spec.kind === 'white' || spec.kind === 'black') {
    const runs =
      spec.kind === 'white'
        ? [{ text: spec.text, kind: 'plain' as const }]
        : blackRuns(spec.text, spec.answers);
    const layout = fitRuns(
      ctx,
      runs,
      textBox,
      spec.kind === 'white' ? 88 : 76,
      spec.kind === 'white' ? 38 : 30
    );
    // Like the DOM cards: white text sits at the top, black is centred.
    const top =
      spec.kind === 'black'
        ? PAD +
          Math.max(
            0,
            (textBox.height - layout.lines.length * layout.lineHeight) / 2.4
          )
        : PAD;
    drawLayout(ctx, layout, PAD, top, {
      text: ink,
      answerText: INK,
      answerFill: PAPER
    });
  }
  drawFooter(ctx, ink, paper);
}

function drawBack(ctx: CanvasRenderingContext2D, kind: CardKind) {
  const ink = kind === 'black' ? PAPER : INK;
  const paper = kind === 'black' ? NIGHT : PAPER;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // A thin inset frame, like a printed back.
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(28, 28, WIDTH - 56, HEIGHT - 56, 24);
  ctx.stroke();
  ctx.globalAlpha = 1;
  // The wordmark runs up the left edge, so every card of a fanned Hand
  // still shows it whole.
  ctx.save();
  ctx.translate(156, HEIGHT - 66);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = ink;
  setFont(ctx, 150);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('CAHO', 0, 0);
  ctx.restore();
  drawLogo(ctx, WIDTH - 214, 70, 140, ink, paper);
  ctx.save();
  ctx.translate(WIDTH - 66, HEIGHT - 70);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.65;
  setFont(ctx, 24, 700);
  ctx.fillText(kind === 'black' ? 'CARTAS PRETAS' : 'CARTAS BRANCAS', 0, 0);
  ctx.restore();
}

// A deck's side: card edges stacked, slightly uneven.
function drawStripes(ctx: CanvasRenderingContext2D, kind: CardKind) {
  const isBlack = kind === 'black';
  ctx.fillStyle = isBlack ? '#18181b' : '#f4f4f0';
  ctx.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 32; i++) {
    const y = i * 8;
    ctx.fillStyle = isBlack ? '#030304' : '#c9c7bf';
    ctx.globalAlpha = 0.35 + ((i * 37) % 11) / 22;
    ctx.fillRect(0, y + 6, 64, 1.5);
  }
  ctx.globalAlpha = 1;
}

function drawGlow(ctx: CanvasRenderingContext2D) {
  const width = 256;
  const height = 348;
  ctx.filter = 'blur(16px)';
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(38, 40, width - 76, height - 80, 22);
  ctx.fill();
  ctx.filter = 'none';
}

// --- Materials -------------------------------------------------------------

type Entry = {
  material: MeshStandardMaterial;
  dispose: () => void;
  users: number;
};

const faces = new Map<string, Entry>();
// Unused faces kept around for reuse (the hero card flips between answers).
const SPARE_FACES = 48;

// Card art is pure greys, so the lit result is pulled back toward its own
// luminance: the room's warm lamp and pink neon shade the paper without
// tinting it (a hint of lamp warmth stays), and a soft shoulder keeps white
// paper just above 1, under the bloom threshold, so it never blows out.
const PAPER_SHADING = `{
  float cardLuma = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
  vec3 cardGrey = vec3(cardLuma) * vec3(1.0, 0.985, 0.955);
  outgoingLight = mix(cardGrey, outgoingLight, 0.1);
  vec3 cardOver = max(outgoingLight - 0.86, 0.0);
  outgoingLight = min(outgoingLight, vec3(0.86)) + cardOver / (1.0 + cardOver * 4.5);
}
#include <opaque_fragment>`;

function injectPaperShading(shader: { fragmentShader: string }) {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <opaque_fragment>',
    PAPER_SHADING
  );
}

/**
 * Makes a card material shade like paper (see PAPER_SHADING). Clones don't
 * inherit it, so call it on them too.
 *
 * @example
 * const fading = paperShaded(face.clone());
 */
export function paperShaded<T extends MeshStandardMaterial>(material: T): T {
  material.onBeforeCompile = injectPaperShading;
  material.customProgramCacheKey = () => 'caho-paper';
  return material;
}

function makeCardMaterial(
  texture: CanvasTexture,
  isBlack: boolean
): MeshStandardMaterial {
  return paperShaded(
    new MeshStandardMaterial({
      map: texture,
      // Matte paper; the black stock has a satin sheen.
      roughness: isBlack ? 0.38 : 0.78,
      metalness: 0,
      // Emissive from the face itself: a floor so a card turned away from
      // the lamp reads as paper in shadow, never as a coloured silhouette.
      emissive: new Color('#ffffff'),
      emissiveMap: texture,
      emissiveIntensity: 0
    })
  );
}

/**
 * A face material, drawn on first use and shared; pair with `releaseFace`.
 *
 * @example
 * const material = acquireFace({ kind: 'white', text: card.text });
 */
export function acquireFace(spec: FaceSpec): MeshStandardMaterial {
  const key = faceKey(spec);
  let entry = faces.get(key);
  if (entry) {
    faces.delete(key);
  } else {
    const { texture, dispose } = canvasTexture(WIDTH, HEIGHT, ctx =>
      drawFace(ctx, spec)
    );
    const isBlack =
      spec.kind === 'black' ||
      spec.kind === 'black-blank' ||
      (spec.kind === 'hidden' && spec.card === 'black');
    const material = makeCardMaterial(texture, isBlack);
    entry = {
      material,
      users: 0,
      dispose: () => {
        dispose();
        material.dispose();
      }
    };
  }
  // Re-inserted last: the map's order is least recently used first.
  faces.set(key, entry);
  entry.users++;
  return entry.material;
}

/**
 * @example
 * releaseFace(material);
 */
export function releaseFace(material: MeshStandardMaterial) {
  let spare = 0;
  for (const entry of faces.values()) {
    if (entry.material === material) entry.users--;
    if (entry.users <= 0) spare++;
  }
  if (spare <= SPARE_FACES) return;
  for (const [key, entry] of faces) {
    if (spare <= SPARE_FACES) break;
    if (entry.users > 0) continue;
    entry.dispose();
    faces.delete(key);
    spare--;
  }
}

const backs = new Map<CardKind, MeshStandardMaterial>();
// Backs are shared by every card, so their light response is fixed: some
// lamp shading over a floor that keeps far fans neutral.
const BACK_ALBEDO = 0.7;
const BACK_EMISSIVE = 0.3;

/**
 * The shared back (and edge) of every card of a kind.
 *
 * @example
 * backMaterial('black');
 */
export function backMaterial(kind: CardKind): MeshStandardMaterial {
  let material = backs.get(kind);
  if (!material) {
    const { texture } = canvasTexture(WIDTH, HEIGHT, ctx =>
      drawBack(ctx, kind)
    );
    material = makeCardMaterial(texture, kind === 'black');
    material.color.setScalar(BACK_ALBEDO);
    material.emissiveIntensity = BACK_EMISSIVE;
    backs.set(kind, material);
  }
  return material;
}

const sides = new Map<CardKind, MeshStandardMaterial>();

/**
 * @example
 * deckSideMaterial('white');
 */
export function deckSideMaterial(kind: CardKind): MeshStandardMaterial {
  let material = sides.get(kind);
  if (!material) {
    const { texture } = canvasTexture(64, 256, ctx => drawStripes(ctx, kind));
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, kind === 'white' ? 0.8 : 0.55);
    material = paperShaded(
      new MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        emissive: new Color('#ffffff'),
        emissiveMap: texture,
        emissiveIntensity: 0.15
      })
    );
    sides.set(kind, material);
  }
  return material;
}

let glowTexture: CanvasTexture | null = null;

/**
 * A fresh additive halo material (each card tints and fades its own).
 *
 * @example
 * const glow = makeGlowMaterial(); glow.color.set('#ffb000');
 */
export function makeGlowMaterial(): MeshBasicMaterial {
  glowTexture ??= canvasTexture(256, 348, drawGlow).texture;
  return new MeshBasicMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  });
}
