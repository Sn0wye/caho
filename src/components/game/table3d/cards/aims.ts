import { Euler, Matrix4, Vector3 } from 'three';
import type { CursorPosition } from '@/contracts';
import type { FeltCard } from '../../table/felt-cards';
import {
  CAMERA_FOV,
  CARD_HEIGHT,
  CARD_THICKNESS,
  CARD_WIDTH,
  flatPose,
  heldHandSlot,
  type CardPose,
  type Seat3D
} from '../space';
import type { Aim, FrameContext } from './entity';
import {
  answerPose,
  CARD_ASPECT,
  faceToward,
  fromCardPose,
  HERO_SCALE,
  makeTarget,
  propUp,
  viewExtents,
  WINNER_SCALE,
  type Target
} from './poses';

// Aims: functions that write a card's target for this frame. Static ones copy
// a precomputed pose; live ones follow the camera, cursors and hover.

/**
 * A fixed pose; `prop` leans a face-up card toward its reader (see propUp).
 *
 * @example
 * still(playedPose(seat, 0, 1));
 * still(stagedPose(self, 0, 1), STAGED_SCALE, STAGED_PROP);
 */
export function still(pose: CardPose, scale = 1, prop = 0): Aim {
  const target = fromCardPose(makeTarget(), pose, scale);
  if (prop) propUp(target, prop);
  return (_, out) => copyTarget(out, target);
}

function copyTarget(out: Target, from: Target) {
  out.space = from.space;
  out.position.copy(from.position);
  out.quaternion.copy(from.quaternion);
  out.scale = from.scale;
}

/**
 * A card in another Player's fan; rises while their cursor rests on it.
 *
 * @example
 * heldAim(seat, 3, 10, seats.length);
 */
export function heldAim(
  seat: Seat3D,
  slot: number,
  size: number,
  seatCount: number
): Aim {
  const lifted = fromCardPose(
    makeTarget(),
    heldHandSlot(seat, slot, size, seatCount, true)
  );
  const resting = fromCardPose(
    makeTarget(),
    heldHandSlot(seat, slot, size, seatCount, false)
  );
  const playerId = seat.player.id;
  return (ctx, out) => {
    copyTarget(out, ctx.heldLift.get(playerId) === slot ? lifted : resting);
    // Near the camera the fan folds down behind the rim as it fades out.
    const fade = ctx.seatFade.get(playerId) ?? 1;
    if (fade < 1) {
      out.scale *= 0.45 + 0.55 * fade;
      out.position.y -= (1 - fade) * 0.12;
    }
  };
}

// How this Player's Hand sits: playing, waiting after playing, judging (they
// don't play) or tucked away while the answers are on the felt.
export type HandMode = 'play' | 'waiting' | 'judge' | 'tucked';

export const HAND_DEPTH = 0.6;
const handEuler = new Euler(0, 0, 0, 'YXZ');

// The HUD's hint pill / confirm button sits right above the resting Hand,
// its bottom edge this far down the view.
const HAND_PILL_BOTTOM = 0.7;

export type HandLayout = {
  halfHeight: number;
  halfWidth: number;
  cardHeight: number;
  cardWidth: number;
  scale: number;
  // Distance between neighbouring cards' centres.
  step: number;
  // Where the resting middle card's top edge is (view y, camera space).
  restTop: number;
  // Where a hovered card's bottom edge goes.
  liftBottom: number;
};

/**
 * Where this Player's Hand sits in camera space, `HAND_DEPTH` in front of the
 * camera: sized from the view so it looks the same on every screen.
 *
 * @example
 * const layout = handLayout(camera.fov, camera.aspect, hand.length);
 */
export function handLayout(fov: number, aspect: number, size: number) {
  const { halfHeight, halfWidth } = viewExtents(fov, aspect, HAND_DEPTH);
  // Height as a share of the view, a little less on narrow screens.
  const share = Math.min(0.3, 0.19 + 0.05 * aspect);
  const cardHeight = halfHeight * 2 * share;
  const scale = cardHeight / CARD_HEIGHT;
  const cardWidth = CARD_WIDTH * scale;
  // Each card shows most of its width, so the first words of every line
  // read in the resting fan; narrow screens overlap more.
  const step =
    size > 1
      ? Math.min(
          cardWidth * 0.8,
          (halfWidth * 2 * 0.94 - cardWidth) / (size - 1)
        )
      : 0;
  return {
    halfHeight,
    halfWidth,
    cardHeight,
    cardWidth,
    scale,
    step,
    restTop: -halfHeight + cardHeight * 0.92,
    liftBottom: halfHeight * (1 - 2 * HAND_PILL_BOTTOM)
  } satisfies HandLayout;
}

/**
 * The Hand slot under a camera-space x in the resting fan: the topmost card
 * whose left edge is left of it (a card covers its left neighbour's right
 * side), so hovering doesn't depend on where the lifted card went.
 *
 * @example
 * handSlotAt(layout, pointInCamera.x, hand.length); // 3
 */
export function handSlotAt(layout: HandLayout, x: number, size: number) {
  const first = -((size - 1) / 2) * layout.step - layout.cardWidth / 2;
  const slot = Math.floor((x - first) / Math.max(layout.step, 1e-6));
  return Math.max(0, Math.min(size - 1, slot));
}

/**
 * This Player's Hand card `slot` of `size`: a gently arced fan along the
 * bottom of the view, in camera space so it follows any camera move. The
 * hovered card rises clear of the fan and grows, whole and readable; its
 * neighbours part.
 *
 * @example
 * handAim(2, 10, 'play');
 */
export function handAim(slot: number, size: number, mode: HandMode): Aim {
  return (ctx, out) => {
    const camera = ctx.camera;
    const layout = handLayout(
      camera.fov ?? CAMERA_FOV,
      camera.aspect ?? 16 / 9,
      size
    );
    const { cardHeight, cardWidth, step, halfHeight, halfWidth } = layout;
    const fromMiddle = slot - (size - 1) / 2;
    const spread = size > 1 ? fromMiddle / ((size - 1) / 2) : 0;

    let x = fromMiddle * step;
    // An arc like a hand of cards held low: the ends drop and turn out.
    let y =
      -halfHeight + cardHeight * 0.42 - spread * spread * cardHeight * 0.2;
    let z = -HAND_DEPTH + slot * 0.0005;
    let roll = -spread * 0.2;
    let grow = 1;

    const hovered = ctx.hoveredHandSlot;
    const isLive = mode === 'play' || mode === 'waiting';
    if (isLive && hovered !== null) {
      const distance = slot - hovered;
      if (distance === 0) {
        // Up by half a card: whole and readable, without hiding the Black
        // Card floating over the table.
        grow = 1.08;
        y = -halfHeight + cardHeight * 0.8;
        z += 0.04;
        roll = 0;
        const edge = halfWidth * 0.96 - (cardWidth * grow) / 2;
        x = Math.max(-edge, Math.min(edge, x));
      }
      // The neighbours stay put: only the card under the pointer moves.
    }
    if (mode === 'waiting') y -= cardHeight * 0.14;
    // The Judge sets the Hand aside, out of view: they get the gavel.
    if (mode === 'judge') y -= cardHeight * 1.5;
    if (mode === 'tucked') y -= cardHeight * 0.66;

    out.space = 'camera';
    out.position.set(x, y, z);
    handEuler.set(-0.04, 0, roll, 'YXZ');
    out.quaternion.setFromEuler(handEuler);
    out.scale = layout.scale * grow;
  };
}

/**
 * Card `index` of answer `answerIndex` on its felt rect; the whole answer
 * rises when the Judge lifts or picks it.
 *
 * @example
 * answerAim(rects[1], 1, 0, 2);
 */
export function answerAim(
  rect: FeltCard,
  answerIndex: number,
  index: number,
  count: number
): Aim {
  return (ctx, out) =>
    answerPose(
      out,
      rect,
      index,
      count,
      ctx.liftedAnswer === answerIndex || ctx.chosenAnswer === answerIndex
    );
}

/**
 * Face-down answers gathered in a pile at the centre before they're dealt.
 *
 * @example
 * gatherAim(3, judgeYaw(rects[0]));
 */
export function gatherAim(order: number, yaw: number): Aim {
  const wobble = Math.sin(order * 12.9898) * 0.5;
  return still(
    flatPose(
      { x: wobble * 0.02, y: Math.cos(order * 4.1) * 0.012 },
      yaw + wobble * 0.25,
      {
        faceDown: true,
        height: 0.003 + order * CARD_THICKNESS * 1.15
      }
    )
  );
}

const eye = new Vector3();

function cameraEye(ctx: FrameContext) {
  return eye.setFromMatrixPosition(ctx.camera.matrixWorld);
}

const far = new Vector3();
const inView = new Vector3();
const viewMatrix = new Matrix4();

// The HUD's top banner and pills end about here (fraction of the view height
// from the top); a card that must stay readable keeps below it.
const HUD_TOP = 0.15;

type ViewFrame = { depth: number; halfHeight: number; halfWidth: number };

// A world point in the camera's frame, and the view's half extents there.
function toView(ctx: FrameContext, point: Vector3, out: Vector3): ViewFrame {
  const camera = ctx.camera;
  viewMatrix.copy(camera.matrixWorld).invert();
  out.copy(point).applyMatrix4(viewMatrix);
  const depth = Math.max(0.6, -out.z);
  const halfHeight =
    depth * Math.tan(((camera.fov ?? CAMERA_FOV) * Math.PI) / 360);
  return {
    depth,
    halfHeight,
    halfWidth: halfHeight * (camera.aspect ?? 16 / 9)
  };
}

/**
 * The round's Black Card floating over the table, facing the camera with a
 * gentle bob. While judging it retreats up and to the far side of the table
 * (as seen from the camera), past the answers' grid, so the grid stays clear;
 * it keeps a readable size and stays whole on screen, between the grid and
 * the HUD's banner, whatever the camera does.
 *
 * @example
 * heroAim('playing', self.direction);
 * heroAim('judging', self.direction, rects);
 */
export function heroAim(
  stage: 'playing' | 'judging',
  direction: CursorPosition,
  rects: FeltCard[] = []
): Aim {
  // Share of the view's height the card fills while judging.
  const share = 0.25;
  return (ctx, out) => {
    // Still: the Black Card is read, it shouldn't drift while you do.
    const bob = 0;
    out.space = 'world';
    if (stage === 'playing') {
      out.position.set(direction.x * 0.1, 0.34 + bob, direction.y * 0.1);
      out.scale = HERO_SCALE.playing;
      faceToward(out, cameraEye(ctx), 0, screenUp(ctx));
      return;
    }
    const eyeAt = cameraEye(ctx);
    far.set(-eyeAt.x, 0, -eyeAt.z);
    // Straight above the table there is no far side: use this seat's.
    if (far.lengthSq() < 0.09) far.set(-direction.x, 0, -direction.y);
    far.normalize();
    // The grid's far edge, where its propped-up back row ends.
    const reach = gridReach(rects, far.x, far.z);
    edge.copy(far).multiplyScalar(reach);
    edge.y = 0.11;
    const edgeView = toView(ctx, edge, inView);
    const bandBottom = inView.y / edgeView.halfHeight + 0.04;
    const bandTop = 1 - 2 * HUD_TOP;

    far.multiplyScalar(Math.max(0.62, reach + 0.1));
    far.y = 0.56;
    const view = toView(ctx, far, inView);
    // Heights and positions as fractions of the view (-1 bottom, 1 top).
    const height = Math.max(0.3, Math.min(share * 2, bandTop - bandBottom));
    const anchor = inView.y / view.halfHeight;
    const centre = Math.min(
      bandTop - height / 2,
      Math.max(bandBottom + height / 2, anchor)
    );
    const cardHeight = height * view.halfHeight;
    const cardWidth = cardHeight / CARD_ASPECT;
    inView.y = (centre + bob) * view.halfHeight;
    const side = view.halfWidth * 0.94 - cardWidth / 2;
    inView.x = Math.min(side, Math.max(-side, inView.x));
    out.position.copy(inView).applyMatrix4(ctx.camera.matrixWorld);
    out.scale = cardHeight / CARD_HEIGHT;
    faceToward(out, eyeAt, 0, screenUp(ctx));
  };
}

const edge = new Vector3();
const upOnScreen = new Vector3();

// The camera's own up: a card facing the camera stays upright on screen even
// looking straight down, where the world's up is no help.
function screenUp(ctx: { camera: { matrixWorld: Matrix4 } }): Vector3 {
  return upOnScreen.setFromMatrixColumn(ctx.camera.matrixWorld, 1);
}

// How far the felt rects reach along the table-space direction (x, y).
function gridReach(rects: FeltCard[], x: number, y: number): number {
  let reach = 0;
  for (const rect of rects) {
    const angle = (rect.turnDeg * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const along =
      rect.center.x * x +
      rect.center.y * y +
      (Math.abs(cos * x + sin * y) * rect.width) / 2 +
      (Math.abs(-sin * x + cos * y) * rect.height) / 2;
    reach = Math.max(reach, along);
  }
  return reach;
}

/**
 * The result line-up facing the camera, near the middle of the view under
 * the HUD's banner: the Black Card and, to its right, the winning answer's
 * cards. `slot` -1 is the Black Card.
 *
 * @example
 * resultAim(-1, 1); resultAim(0, 1);
 */
export function resultAim(slot: number, count: number): Aim {
  return (ctx, out) => {
    const bob = 0;
    const eyeAt = cameraEye(ctx);
    // About two thirds of the way to the table's centre.
    const depth = Math.max(0.9, eyeAt.length() * 0.68);
    const halfHeight =
      depth * Math.tan(((ctx.camera.fov ?? CAMERA_FOV) * Math.PI) / 360);
    const halfWidth = halfHeight * (ctx.camera.aspect ?? 16 / 9);
    let heroHeight = halfHeight * 2 * 0.4;
    const gap = heroHeight * 0.06;
    const winnerRatio = WINNER_SCALE / HERO_SCALE.result;
    const widthOf = (height: number) =>
      height / CARD_ASPECT +
      count * ((height * winnerRatio) / CARD_ASPECT + gap);
    // Shrink a pick-3 line-up to fit the width.
    const room = halfWidth * 2 * 0.86;
    if (widthOf(heroHeight) > room) heroHeight *= room / widthOf(heroHeight);
    const heroWidth = heroHeight / CARD_ASPECT;
    const winnerWidth = heroWidth * winnerRatio;
    const total = widthOf(heroHeight);
    const x =
      slot < 0
        ? -total / 2 + heroWidth / 2
        : -total / 2 +
          heroWidth +
          gap +
          slot * (winnerWidth + gap) +
          winnerWidth / 2;
    // Centred a touch below the middle, clear of the banner up top.
    const y = halfHeight * (-0.06 + bob);
    // Winners stand a hair in front of the Black Card.
    const z = -depth + (slot >= 0 ? 0.02 + slot * 0.004 : 0);
    out.space = 'world';
    out.position.set(x, y, z).applyMatrix4(ctx.camera.matrixWorld);
    faceToward(out, eyeAt, 0, screenUp(ctx));
    out.scale =
      (slot < 0 ? heroHeight : heroHeight * winnerRatio) / CARD_HEIGHT;
  };
}
