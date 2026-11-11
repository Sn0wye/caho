'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  type Group,
  type Material,
  type Mesh,
  type MeshBasicMaterial
} from 'three';
import { FLOOR_Y, nearCameraFade, type Seat3D, type Vec3 } from '../space';
import { fx } from '../store';
import {
  badge,
  drawMedallion,
  drawNameplate,
  LABEL_PX,
  PLATE_CAP_PX,
  PLATE_PAD,
  PLATE_ROW,
  useFontsReady,
  type NameplateTag
} from './labels';

// What a pawn is doing, derived from the game by Players3D.
export type PawnMood =
  | 'idle'
  | 'waiting'
  | 'ready'
  | 'thinking'
  | 'played'
  | 'winner'
  | 'champion';

export type PawnRole = {
  mood: PawnMood;
  hasCrown: boolean;
  tag: NameplateTag;
};

type PawnProps = {
  seat: Seat3D;
  role: PawnRole;
  // Seconds to wait before dropping in (staggers the first mount).
  dropDelay: number;
  isLeaving: boolean;
  // Where to look instead of its own cursor (e.g. the Round's winner).
  focus: Vec3 | null;
};

// Pawn-local heights, from the floor up. The head clears the held Hand.
const HEAD_Y = 1.245;
const HEAD_RADIUS = 0.118;
const NECK_Y = 1.11;
const TOP_Y = HEAD_Y + HEAD_RADIUS;
const DROP_HEIGHT = 2.4;
const GRAVITY = 9.5;

function bodyProfile(): Vector2[] {
  const points = [
    [0, 0],
    [0.21, 0],
    [0.222, 0.02],
    [0.215, 0.05],
    [0.19, 0.072],
    [0.175, 0.095],
    [0.18, 0.115],
    [0.165, 0.135]
  ];
  // A concave skirt: flares at the foot, slim up to the collar.
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    points.push([0.05 + 0.11 * (1 - t) ** 2.6, 0.145 + t * 0.915]);
  }
  points.push(
    [0.07, 1.075],
    [0.115, 1.095],
    [0.122, 1.11],
    [0.115, 1.125],
    [0.07, 1.138],
    [0.05, 1.16],
    [0, 1.17]
  );
  return points.map(([r, y]) => new Vector2(r, y));
}

// Shared by every pawn.
const BODY = new LatheGeometry(bodyProfile(), 48);
const HEAD = new SphereGeometry(HEAD_RADIUS, 40, 28);
const BEZEL = new CylinderGeometry(0.07, 0.072, 0.03, 40).rotateX(Math.PI / 2);
const MEDALLION = new CircleGeometry(0.06, 40);
const COLLAR = new TorusGeometry(0.123, 0.011, 12, 48).rotateX(Math.PI / 2);
const PLANE = new PlaneGeometry(1, 1);
const DOT = new SphereGeometry(0.0115, 12, 8);
const BUBBLE = new CapsuleGeometry(0.026, 0.07, 6, 16).rotateZ(Math.PI / 2);
const BUBBLE_SMALL = new SphereGeometry(0.011, 12, 8);
const CROWN_BAND = new CylinderGeometry(0.062, 0.056, 0.036, 40, 1, true);
const CROWN_POINT = new ConeGeometry(0.014, 0.04, 12);
const CROWN_GEM = new SphereGeometry(0.009, 10, 8);

const BRASS = new MeshStandardMaterial({
  color: '#c9a24f',
  metalness: 1,
  roughness: 0.28
});
const GOLD = new MeshStandardMaterial({
  color: '#f0c050',
  metalness: 1,
  roughness: 0.2,
  emissive: '#6b4a10',
  emissiveIntensity: 0.6,
  side: DoubleSide
});
const RUBY = new MeshStandardMaterial({
  color: '#e1306c',
  roughness: 0.15,
  emissive: '#5a0a24',
  emissiveIntensity: 0.8
});
const BUBBLE_MATERIAL = new MeshStandardMaterial({
  color: '#f4f4f5',
  roughness: 0.5,
  emissive: '#3f3f46',
  emissiveIntensity: 0.6
});
const DOT_MATERIAL = new MeshStandardMaterial({
  color: '#18181b',
  roughness: 0.6
});

const GREY = new Color('#71717a');
const READY_GLOW = new Color('#34d399');
const noRaycast = () => null;
const scratch = new Vector3();
const forward = new Vector3();
const fadeAt: Vec3 = [0, 0, 0];
// Height of the nameplate's bottom above the head top, bare and crowned.
const PLATE_Y = 0.015;
const PLATE_Y_CROWN = 0.1;
// Cap height of a nameplate's name on screen, in CSS px: readable at the far
// side of the table without ballooning for near pawns.
const PLATE_SCREEN_CAP = 14;
const PLATE_SCALE_MIN = 0.55;
const PLATE_SCALE_MAX = 2.2;
// The badge's diameter and its place on the plate's top right corner, in
// canvas px.
const BADGE_PX = 30;

/**
 * Fades one material by `fade` (1 solid, 0 gone). Solid materials dither with
 * alpha hashing, so there is no sorting and the lathed body shows no seams;
 * materials already see-through just scale their opacity.
 *
 * @example
 * setFade(material, 1, 0.5, false);
 */
function setFade(
  material: Material,
  base: number,
  fade: number,
  isBaseTransparent: boolean
) {
  material.opacity = base * fade;
  const hash = fade < 0.999 && !isBaseTransparent;
  if (material.alphaHash !== hash) {
    material.alphaHash = hash;
    material.needsUpdate = true;
  }
}

type Spring = { x: number; v: number };

function spring(
  s: Spring,
  target: number,
  stiffness: number,
  damping: number,
  dt: number
) {
  s.v += (stiffness * (target - s.x) - damping * s.v) * dt;
  s.x += s.v * dt;
}

function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * One other Player standing at the table: a tall glossy pawn in their seat
 * colour, with a medallion face, a nameplate, and whatever their role and mood
 * call for (crown, thinking bubble, check). Moves with springs, never state.
 *
 * @example
 * <Pawn seat={seat} role={role} dropDelay={0} isLeaving={false} focus={null} />
 */
export function Pawn({ seat, role, dropDelay, isLeaving, focus }: PawnProps) {
  const { player, color } = seat;
  const isFontReady = useFontsReady();

  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const lean = useRef<Group>(null);
  const overlay = useRef<Group>(null);
  const billboard = useRef<Group>(null);
  const crown = useRef<Group>(null);
  const bubble = useRef<Group>(null);
  const dots = useRef<(Mesh | null)[]>([]);
  const plateGroup = useRef<Group>(null);
  const badgeMesh = useRef<Mesh>(null);
  const plateMaterial = useRef<MeshBasicMaterial>(null);
  const badgeMaterial = useRef<MeshBasicMaterial>(null);
  const medallionMaterial = useRef<MeshStandardMaterial>(null);
  const fadeState = useRef({ value: 1, isCasting: true });

  // Props the frame loop reads.
  const live = useRef({ seat, role, isLeaving, focus });
  useEffect(() => {
    live.current = { seat, role, isLeaving, focus };
  }, [seat, role, isLeaving, focus]);

  const sim = useRef({
    x: { x: seat.world[0], v: 0 },
    z: { x: seat.world[2], v: 0 },
    baseYaw: { x: seat.yaw, v: 0 },
    y: isLeaving ? 0 : DROP_HEIGHT,
    vy: 0,
    isAirborne: !isLeaving,
    delay: dropDelay,
    squash: { x: 0, v: 0 },
    look: { x: 0, v: 0 },
    lean: { x: 0, v: 0 },
    spin: { x: 0, v: 0 },
    spinTarget: 0,
    crown: { x: 0, v: 0 },
    bubble: { x: 0, v: 0 },
    badge: { x: 0, v: 0 },
    pop: 0,
    nextJump: 0,
    phase: Math.random() * 10,
    time: 0,
    hop: 0,
    dodge: 0
  });

  // One-shot hops: played a card, got ready.
  useEffect(
    () =>
      fx.on(event => {
        if (
          (event.type === 'player-played' || event.type === 'player-ready') &&
          event.playerId === player.id
        ) {
          sim.current.hop = 1.7;
        }
      }),
    [player.id]
  );

  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        roughness: 0.26,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        sheen: 0.2
      }),
    []
  );
  const collarMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#18161b',
        roughness: 0.35,
        metalness: 0.4,
        emissive: '#000000'
      }),
    []
  );
  // The small parts are shared by design, but each pawn fades on its own.
  const parts = useMemo(
    () => ({
      brass: BRASS.clone(),
      gold: GOLD.clone(),
      ruby: RUBY.clone(),
      bubble: BUBBLE_MATERIAL.clone(),
      dot: DOT_MATERIAL.clone()
    }),
    []
  );
  useEffect(() => {
    parts.bubble.transparent = true;
    parts.dot.transparent = true;
  }, [parts]);
  useEffect(
    () => () => Object.values(parts).forEach(part => part.dispose()),
    [parts]
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => collarMaterial.dispose(), [collarMaterial]);

  const isInactive = !player.isActive;
  useEffect(() => {
    material.color.set(color);
    if (isInactive) material.color.lerp(GREY, 0.75);
    material.transparent = isInactive;
    material.opacity = isInactive ? 0.38 : 1;
    material.depthWrite = !isInactive;
    material.needsUpdate = true;
  }, [material, color, isInactive]);

  const isReadyGlow = role.mood === 'ready' || role.mood === 'played';
  useEffect(() => {
    collarMaterial.emissive.copy(isReadyGlow ? READY_GLOW : new Color(color));
    collarMaterial.emissiveIntensity = isReadyGlow ? 2.2 : 0.25;
  }, [collarMaterial, isReadyGlow, color]);

  const medallion = useMemo(
    () => drawMedallion(player.username, color, player.avatarUrl),
    // Redraw once the font is in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.username, color, player.avatarUrl, isFontReady]
  );
  useEffect(() => () => medallion.dispose(), [medallion]);

  const plate = useMemo(
    () =>
      drawNameplate({
        name: player.username,
        score: player.score,
        color,
        isHost: player.isHost,
        tag: role.tag
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.username, player.score, color, player.isHost, role.tag, isFontReady]
  );
  useEffect(() => () => plate.texture.dispose(), [plate]);

  const badgeKind =
    role.mood === 'ready' || role.mood === 'played'
      ? 'check'
      : role.mood === 'waiting'
        ? 'wait'
        : null;
  const badgeMap = badge(badgeKind ?? 'check');

  useFrame(({ camera, size }, delta) => {
    const s = sim.current;
    const now = live.current;
    const dt = Math.min(delta, 1 / 30);
    const group = root.current;
    if (!group || !body.current || !lean.current || !overlay.current) return;

    if (s.delay > 0) {
      s.delay -= dt;
      group.visible = false;
      return;
    }
    group.visible = true;
    s.time += dt;

    // Glide to the seat when the table re-arranges.
    spring(s.x, now.seat.world[0], 38, 11, dt);
    spring(s.z, now.seat.world[2], 38, 11, dt);
    const yawGap = wrapAngle(now.seat.yaw - s.baseYaw.x);
    spring(s.baseYaw, s.baseYaw.x + yawGap, 38, 11, dt);

    const mood = now.role.mood;
    const isCelebrating = mood === 'winner' || mood === 'champion';

    // Jumps: one-shot hops, and a celebration loop for the winner.
    if (!s.isAirborne) {
      if (s.hop > 0) {
        s.vy = s.hop;
        s.hop = 0;
        s.isAirborne = true;
        s.squash.v -= 3;
      } else if (isCelebrating) {
        s.nextJump -= dt;
        if (s.nextJump <= 0) {
          s.vy = 2.7;
          s.isAirborne = true;
          s.squash.v -= 5;
          s.spinTarget += Math.PI * 2;
          s.nextJump = mood === 'champion' ? 0.55 : 0.18;
        }
      }
    }
    if (s.isAirborne) {
      s.vy -= GRAVITY * dt;
      s.y += s.vy * dt;
      if (s.y <= 0 && s.vy < 0) {
        const impact = -s.vy;
        s.y = 0;
        s.squash.v += impact * 2.4;
        if (impact > 1.4) s.vy = impact * 0.3;
        else {
          s.vy = 0;
          s.isAirborne = false;
        }
      }
    }
    spring(s.squash, 0, 260, 11, dt);
    spring(s.spin, s.spinTarget, 26, 8, dt);

    // Attention: lean and turn toward its cursor (or the moment's focus).
    // Only the moment's focus (a celebration) turns a pawn. Following its
    // own cursor kept every pawn swaying all game long.
    const target: Vec3 | null = now.focus;
    let lookTarget = 0;
    let leanTarget = 0;
    if (target) {
      const angle = Math.atan2(target[0] - s.x.x, target[2] - s.z.x);
      const relative = wrapAngle(angle - s.baseYaw.x);
      lookTarget = Math.max(-0.7, Math.min(0.7, relative)) * 0.55;
      leanTarget = 0.03;
    }
    if (mood === 'thinking') leanTarget -= 0.02;
    spring(s.look, lookTarget, 30, 9, dt);
    spring(s.lean, leanTarget, 30, 8, dt);

    // Pop away when leaving.
    let scale = 1;
    if (now.isLeaving) {
      s.pop = Math.min(1, s.pop + dt / 0.38);
      scale =
        s.pop < 0.3 ? 1 + s.pop * 0.6 : 1.18 * (1 - (s.pop - 0.3) / 0.7) ** 2;
    }

    const breath = 0;
    const stretch = s.isAirborne ? Math.min(0.12, Math.abs(s.vy) * 0.03) : 0;
    const scaleY = 1 - s.squash.x + breath + stretch;
    const scaleXZ = 1 + s.squash.x * 0.55 - stretch * 0.5;

    group.position.set(s.x.x, FLOOR_Y, s.z.x);
    group.scale.setScalar(scale);

    // Next to the camera a pawn would wall off the felt: fade it out, parts
    // and shadow included. Checked every frame, the camera orbits.
    fadeAt[0] = s.x.x;
    fadeAt[2] = s.z.x;
    // In or out, never parked half-way: a half-faded pawn is a cloud of
    // dither, so ease quickly toward whichever side it is on.
    const f = fadeState.current;
    const isShown = nearCameraFade(camera.position, fadeAt) > 0.5;
    f.value += ((isShown ? 1 : 0) - f.value) * Math.min(1, dt * 9);
    if (Math.abs(f.value - (isShown ? 1 : 0)) < 0.004)
      f.value = isShown ? 1 : 0;
    const fade = f.value;
    const baseOpacity = now.seat.player.isActive ? 1 : 0.38;
    const isSolid = now.seat.player.isActive;
    setFade(material, baseOpacity, fade, !isSolid);
    setFade(collarMaterial, 1, fade, false);
    setFade(parts.brass, 1, fade, false);
    setFade(parts.gold, 1, fade, false);
    setFade(parts.ruby, 1, fade, false);
    if (medallionMaterial.current) {
      setFade(medallionMaterial.current, isSolid ? 1 : 0.45, fade, !isSolid);
    }
    parts.bubble.opacity = fade;
    parts.dot.opacity = fade;
    if (plateMaterial.current) {
      plateMaterial.current.opacity = (isSolid ? 1 : 0.6) * fade;
    }
    const isCasting = fade > 0.05;
    if (f.isCasting !== isCasting) {
      f.isCasting = isCasting;
      group.traverse(object => {
        if (object.userData.casts) object.castShadow = isCasting;
      });
    }
    if (fade < 0.01) {
      group.visible = false;
      return;
    }
    body.current.position.y = s.y;
    body.current.rotation.y = s.baseYaw.x + s.look.x + s.spin.x;
    body.current.scale.set(scaleXZ, scaleY, scaleXZ);
    lean.current.rotation.x = s.lean.x;
    lean.current.rotation.z = Math.sin(s.time * 0.9 + s.phase) * 0.018;

    // Overlays follow the head without squashing.
    overlay.current.position.y = s.y + TOP_Y * scaleY;
    overlay.current.position.x =
      Math.sin(s.lean.x) * TOP_Y * Math.sin(body.current.rotation.y);
    overlay.current.position.z =
      Math.sin(s.lean.x) * TOP_Y * Math.cos(body.current.rotation.y);
    spring(s.crown, now.role.hasCrown ? 1 : 0, 120, 12, dt);
    if (billboard.current && plateGroup.current) {
      billboard.current.quaternion.copy(camera.quaternion);
      // Hold the plate at a fixed size on screen: world units per screen px
      // at its depth, from the vertical field of view.
      overlay.current.getWorldPosition(scratch);
      const depth = Math.max(
        0.5,
        scratch.sub(camera.position).dot(camera.getWorldDirection(forward))
      );
      const fov = 'fov' in camera ? (camera.fov as number) : 38;
      const pixelsPerUnit =
        size.height / (2 * depth * Math.tan((fov * Math.PI) / 360));
      const labelScale = Math.min(
        PLATE_SCALE_MAX,
        Math.max(
          PLATE_SCALE_MIN,
          PLATE_SCREEN_CAP / (PLATE_CAP_PX * LABEL_PX * pixelsPerUnit)
        )
      );
      plateGroup.current.scale.setScalar(labelScale);
      plateGroup.current.position.y =
        PLATE_Y +
        (PLATE_Y_CROWN - PLATE_Y) * Math.max(0, Math.min(1, s.crown.x));
    }

    if (crown.current) {
      const c = Math.max(0, s.crown.x);
      crown.current.visible = c > 0.01;
      crown.current.scale.setScalar(c * 1.3);
      crown.current.position.y = -0.022 + Math.sin(s.time * 2) * 0.006;
      crown.current.rotation.y = s.time * 0.8;
      crown.current.rotation.z = 0.12;
    }

    spring(s.bubble, mood === 'thinking' ? 1 : 0, 140, 13, dt);
    if (bubble.current) {
      const b = Math.max(0, s.bubble.x);
      bubble.current.visible = b > 0.01;
      bubble.current.scale.setScalar(b * 0.75);
      dots.current.forEach((dot, i) => {
        if (dot)
          dot.position.y = Math.max(0, Math.sin(s.time * 6 - i * 0.9)) * 0.011;
      });
    }

    spring(s.badge, badgeKind ? 1 : 0, 160, 12, dt);
    if (badgeMesh.current) {
      const b = Math.max(0, s.badge.x);
      badgeMesh.current.visible = b > 0.01;
      badgeMesh.current.scale.setScalar(BADGE_PX * LABEL_PX * b);
    }
    if (badgeMaterial.current) badgeMaterial.current.opacity = fade;
  });

  const plateHeight = plate.height * LABEL_PX;
  const rowWidth = (plate.rowWidth ?? plate.width) * LABEL_PX;

  return (
    <group ref={root} visible={false}>
      <group ref={body}>
        <group ref={lean}>
          <mesh
            geometry={BODY}
            material={material}
            castShadow
            userData={{ casts: true }}
            raycast={noRaycast}
          />
          <mesh
            geometry={COLLAR}
            material={collarMaterial}
            position-y={NECK_Y}
            raycast={noRaycast}
          />
          <mesh
            geometry={HEAD}
            material={material}
            position-y={HEAD_Y}
            castShadow
            userData={{ casts: true }}
            raycast={noRaycast}
          />
          <group position={[0, HEAD_Y - 0.004, HEAD_RADIUS - 0.012]}>
            <mesh geometry={BEZEL} material={parts.brass} raycast={noRaycast} />
            <mesh geometry={MEDALLION} position-z={0.0155} raycast={noRaycast}>
              <meshStandardMaterial
                ref={medallionMaterial}
                map={medallion}
                emissiveMap={medallion}
                emissive="#ffffff"
                emissiveIntensity={0.35}
                roughness={0.35}
                transparent={isInactive}
                opacity={isInactive ? 0.45 : 1}
              />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={overlay}>
        <group ref={crown} visible={false}>
          <Crown parts={parts} />
        </group>
        <group ref={billboard}>
          <group ref={plateGroup}>
            <mesh
              geometry={PLANE}
              position={[0, plateHeight / 2 - PLATE_PAD * LABEL_PX, 0]}
              scale={[plate.width * LABEL_PX, plateHeight, 1]}
              raycast={noRaycast}
              renderOrder={2}
            >
              <meshBasicMaterial
                ref={plateMaterial}
                map={plate.texture}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh
              ref={badgeMesh}
              geometry={PLANE}
              position={[
                rowWidth / 2 - 2 * LABEL_PX,
                (PLATE_ROW - PLATE_PAD + 2) * LABEL_PX,
                0.002
              ]}
              visible={false}
              raycast={noRaycast}
              renderOrder={3}
            >
              <meshBasicMaterial
                ref={badgeMaterial}
                map={badgeMap}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
          <group ref={bubble} position={[0.125, -0.055, 0.05]} visible={false}>
            <mesh
              geometry={BUBBLE_SMALL}
              position={[-0.05, -0.05, 0]}
              material={parts.bubble}
              scale={0.6}
              raycast={noRaycast}
            />
            <mesh
              geometry={BUBBLE_SMALL}
              position={[-0.035, -0.032, 0]}
              material={parts.bubble}
              raycast={noRaycast}
            />
            <mesh
              geometry={BUBBLE}
              position={[0.035, 0, 0]}
              material={parts.bubble}
              raycast={noRaycast}
            />
            {[0, 1, 2].map(i => (
              <group
                key={i}
                position={[0.035 + (i - 1) * 0.026, -0.004, 0.024]}
              >
                <mesh
                  ref={dot => {
                    dots.current[i] = dot;
                  }}
                  geometry={DOT}
                  material={parts.dot}
                  raycast={noRaycast}
                />
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

// Brass crown: a band, five points with gems. The Judge's (or champion's).
function Crown({ parts }: { parts: { gold: Material; ruby: Material } }) {
  return (
    <group>
      <mesh
        geometry={CROWN_BAND}
        material={parts.gold}
        position-y={0.018}
        castShadow
        userData={{ casts: true }}
        raycast={noRaycast}
      />
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group
            key={i}
            position={[Math.sin(angle) * 0.059, 0.054, Math.cos(angle) * 0.059]}
          >
            <mesh
              geometry={CROWN_POINT}
              material={parts.gold}
              raycast={noRaycast}
            />
            <mesh
              geometry={CROWN_GEM}
              material={parts.ruby}
              position-y={0.024}
              raycast={noRaycast}
            />
          </group>
        );
      })}
    </group>
  );
}
