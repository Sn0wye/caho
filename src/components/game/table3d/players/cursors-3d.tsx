'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Sprite
} from 'three';
import type { CursorPosition } from '@/contracts';
import { useGame } from '@/hooks/game';
import { feltCardAt, type FeltCard } from '../../table/felt-cards';
import { useAnswerCards } from '../../table/table-judging';
import {
  ANSWER_LIFT,
  CARD_THICKNESS,
  heldHandSlot,
  tableToWorld,
  type Seat3D,
  type Vec3
} from '../space';
import { useHandSize, useJudge, useStage } from '../use-table';
import { drawCursorTag, useFontsReady } from './labels';

// The arrow everyone knows (same path as the 2.5D cursor's SVG), drawn flat
// and facing the screen like a real pointer: tip up and to the left, on the
// exact spot it points at, the same size wherever it is on the table.
const ARROW_PATH: [number, number][] = [
  [3, 2],
  [19, 13],
  [11.5, 14],
  [8, 22]
];
const ARROW_CANVAS = 128;
const ARROW_DRAW_SCALE = 5;
const ARROW_PAD = 8;
// Where the tip is in the texture, as the sprite's centre.
const ARROW_TIP: [number, number] = [
  (ARROW_PATH[0][0] * ARROW_DRAW_SCALE + ARROW_PAD) / ARROW_CANVAS,
  1 - (ARROW_PATH[0][1] * ARROW_DRAW_SCALE + ARROW_PAD) / ARROW_CANVAS
];
// Sizes on screen, px.
const ARROW_SCREEN = 28;
const TAG_OFFSET = { x: 15, y: 17 };
const noRaycast = () => null;
// Cursor tag text: its font size in canvas px, and the size on screen we want.
const TAG_TEXT_PX = 22;
const TAG_SCREEN_TEXT = 11.5;

function drawArrow(color: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = ARROW_CANVAS;
  const context = canvas.getContext('2d');
  if (context) {
    context.beginPath();
    ARROW_PATH.forEach(([x, y], index) => {
      const px = x * ARROW_DRAW_SCALE + ARROW_PAD;
      const py = y * ARROW_DRAW_SCALE + ARROW_PAD;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.closePath();
    context.lineJoin = 'round';
    context.lineWidth = 8;
    context.strokeStyle = '#09090b';
    context.stroke();
    context.fillStyle = color;
    context.fill();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

type CursorContext = {
  seatCount: number;
  handSize: (playerId: string) => number;
  answerCards: FeltCard[];
  judgeId: string | null;
  isJudging: boolean;
};

/**
 * Where a Player's cursor tip sits in the world, by the same rules as the 2.5D
 * table: on their held card, on the answer the Judge lifts, or on the felt.
 *
 * @example
 * cursorTip(seat, cursor, context); // [x, y, z]
 */
function cursorTip(
  seat: Seat3D,
  cursor: CursorPosition,
  context: CursorContext
): Vec3 {
  const size = context.handSize(seat.player.id);
  if (cursor.card != null && size > 0) {
    const pose = heldHandSlot(
      seat,
      Math.min(cursor.card, size - 1),
      size,
      context.seatCount,
      true
    );
    // A hair toward the table so the tip sits on the card's back, not in it.
    const [x, y, z] = pose.position;
    return [x - seat.direction.x * 0.012, y, z - seat.direction.y * 0.012];
  }
  const isLifted =
    context.isJudging &&
    seat.player.id === context.judgeId &&
    feltCardAt(context.answerCards, cursor) !== null;
  return tableToWorld(cursor, isLifted ? ANSWER_LIFT + CARD_THICKNESS : 0);
}

/**
 * The other Players' live pointers, as 3D arrows over the table.
 *
 * @example
 * <Cursors3D seats={seats} />
 */
export function Cursors3D({ seats }: { seats: Seat3D[] }) {
  const { judgeId } = useGame();
  const stage = useStage();
  const handSize = useHandSize();
  const { answers } = useJudge();
  const answerCards = useAnswerCards(answers.length);

  const context = useRef<CursorContext>({
    seatCount: seats.length,
    handSize,
    answerCards,
    judgeId,
    isJudging: false
  });
  useEffect(() => {
    context.current = {
      seatCount: seats.length,
      handSize,
      answerCards,
      judgeId,
      isJudging: stage.kind === 'judging'
    };
  }, [seats.length, handSize, answerCards, judgeId, stage.kind]);

  return seats
    .filter(seat => !seat.isSelf)
    .map(seat => (
      <Cursor3D key={seat.player.id} seat={seat} context={context} />
    ));
}

type CursorProps = {
  seat: Seat3D;
  context: { current: CursorContext };
};

const heading = new Vector3();

function Cursor3D({ seat, context }: CursorProps) {
  const { cursors } = useGame();
  const isFontReady = useFontsReady();
  const group = useRef<Group>(null);
  const arrow = useRef<Sprite>(null);
  const tag = useRef<Sprite>(null);
  const seatRef = useRef(seat);
  useEffect(() => {
    seatRef.current = seat;
  }, [seat]);

  const arrowTexture = useMemo(() => drawArrow(seat.color), [seat.color]);
  useEffect(() => () => arrowTexture.dispose(), [arrowTexture]);

  const label = useMemo(
    () => drawCursorTag(seat.player.username, seat.color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seat.player.username, seat.color, isFontReady]
  );
  useEffect(() => () => label.texture.dispose(), [label]);

  const sim = useRef({ position: new Vector3(), shown: 0, isPlaced: false });

  useFrame(({ camera, size }, delta) => {
    const s = sim.current;
    const root = group.current;
    if (!root || !arrow.current || !tag.current) return;
    const dt = Math.min(delta, 1 / 30);

    const cursor = cursors.snapshot().get(seatRef.current.player.id);
    if (cursor) {
      const tip = cursorTip(seatRef.current, cursor, context.current);
      if (!s.isPlaced) s.position.set(...tip);
      else s.position.lerp(heading.set(...tip), 1 - Math.exp(-dt * 16));
      s.isPlaced = true;
    }
    s.shown += ((cursor ? 1 : 0) - s.shown) * (1 - Math.exp(-dt * 14));
    if (!cursor && s.shown < 0.02) s.isPlaced = false;
    root.visible = s.shown > 0.02;
    if (!root.visible) return;

    root.position.copy(s.position);
    // Fixed sizes on screen: a pointer doesn't shrink with distance.
    const depth = Math.max(0.3, camera.position.distanceTo(root.position));
    const fov = 'fov' in camera ? (camera.fov as number) : 38;
    const unitsPerPixel =
      (2 * depth * Math.tan((fov * Math.PI) / 360)) / size.height;
    arrow.current.scale.setScalar(ARROW_SCREEN * unitsPerPixel);
    arrow.current.material.opacity = s.shown;

    const tagScale = (TAG_SCREEN_TEXT / TAG_TEXT_PX) * unitsPerPixel;
    const tagWidth = label.width * tagScale;
    const tagHeight = label.height * tagScale;
    tag.current.scale.set(tagWidth, tagHeight, 1);
    // Down and to the right of the tip, like the 2.5D cursor's name.
    tag.current.center.set(
      (-TAG_OFFSET.x * unitsPerPixel) / tagWidth,
      1 + (TAG_OFFSET.y * unitsPerPixel) / tagHeight
    );
    tag.current.material.opacity = s.shown;
  });

  // Drawn over everything, like the 2.5D cursors: a pointer hanging below
  // its tip would otherwise sink into the felt.
  return (
    <group ref={group} visible={false}>
      <sprite
        ref={arrow}
        center={ARROW_TIP}
        raycast={noRaycast}
        renderOrder={21}
      >
        <spriteMaterial
          map={arrowTexture}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <sprite ref={tag} raycast={noRaycast} renderOrder={20}>
        <spriteMaterial
          map={label.texture}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}
