'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry
} from 'three';
import {
  FELT_RADIUS,
  FLOOR_Y,
  TABLE_RADIUS,
  type Seat3D,
  type Vec3
} from '../space';
import { fx } from '../store';

const MAX = 900;
const PAPER = new PlaneGeometry(0.022, 0.013);
const EXTRA_COLORS = ['#ffffff', '#f0c050'];

type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  spin: number;
  flutter: number;
  phase: number;
  age: number;
  life: number;
  isLanded: boolean;
};

const dummy = new Object3D();
const scratch = new Color();

/**
 * Paper confetti: a burst over the Round's winner, a long shower over the
 * whole table when the game ends. One instanced mesh, reused.
 *
 * @example
 * <Confetti seats={seats} />
 */
export function Confetti({ seats }: { seats: Seat3D[] }) {
  const mesh = useRef<InstancedMesh>(null);
  const particles = useRef<Particle[]>([]);
  // Showers still to drop: [particles per second, seconds left].
  const shower = useRef({ rate: 0, left: 0, carry: 0 });
  const seatsRef = useRef(seats);
  useEffect(() => {
    seatsRef.current = seats;
  }, [seats]);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        roughness: 0.6,
        side: DoubleSide,
        emissive: '#ffffff',
        emissiveIntensity: 0.12
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  const palette = useMemo(
    () =>
      [...seats.map(seat => seat.color), ...EXTRA_COLORS].map(
        c => new Color(c)
      ),
    [seats]
  );
  const paletteRef = useRef(palette);
  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    const spawn = (particle: Particle) => {
      const list = particles.current;
      if (list.length >= MAX) return;
      list.push(particle);
      const target = mesh.current;
      if (target) {
        const colors = paletteRef.current;
        target.setColorAt(
          list.length - 1,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    };

    const burst = (at: Vec3, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 0.9;
        spawn({
          x: at[0],
          y: at[1],
          z: at[2],
          vx: Math.cos(angle) * speed,
          vy: 1.4 + Math.random() * 1.6,
          vz: Math.sin(angle) * speed,
          rx: Math.random() * 6,
          ry: Math.random() * 6,
          rz: Math.random() * 6,
          spin: 4 + Math.random() * 8,
          flutter: 0.3 + Math.random() * 0.5,
          phase: Math.random() * 6,
          age: 0,
          life: 3.2 + Math.random() * 1.4,
          isLanded: false
        });
      }
    };

    return fx.on(event => {
      if (event.type === 'round-won') {
        const seat = seatsRef.current.find(s => s.player.id === event.playerId);
        if (!seat) return;
        const at: Vec3 =
          event.isSelf || seat.isSelf
            ? [seat.direction.x * 0.85, 0.35, seat.direction.y * 0.85]
            : [seat.world[0], 0.62, seat.world[2]];
        burst(at, 220);
      } else if (event.type === 'game-end') {
        shower.current = { rate: 220, left: 3.5, carry: 60 };
      }
    });
  }, []);

  useFrame((_, delta) => {
    const target = mesh.current;
    if (!target) return;
    const dt = Math.min(delta, 1 / 30);
    const list = particles.current;

    const rain = shower.current;
    if (rain.left > 0) {
      rain.left -= dt;
      rain.carry += rain.rate * dt;
      const colors = paletteRef.current;
      while (rain.carry >= 1) {
        rain.carry -= 1;
        const r = Math.sqrt(Math.random()) * 1.7;
        const angle = Math.random() * Math.PI * 2;
        if (list.length >= MAX) break;
        list.push({
          x: Math.cos(angle) * r,
          // Just above the frame of the seated view, so it rains at once.
          y: 0.8 + Math.random() * 0.9,
          z: Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2,
          vz: (Math.random() - 0.5) * 0.3,
          rx: Math.random() * 6,
          ry: Math.random() * 6,
          rz: Math.random() * 6,
          spin: 3 + Math.random() * 7,
          flutter: 0.3 + Math.random() * 0.5,
          phase: Math.random() * 6,
          age: 0,
          life: 5 + Math.random() * 2,
          isLanded: false
        });
        target.setColorAt(
          list.length - 1,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    }

    if (list.length === 0) {
      target.visible = false;
      return;
    }
    target.visible = true;

    let alive = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      p.age += dt;
      if (p.age >= p.life) continue;
      if (!p.isLanded) {
        // Paper: heavy drag, a low terminal speed, and a side-to-side flutter.
        p.vy -= 3.2 * dt;
        const drag = Math.exp(-dt * 2.4);
        p.vx *= drag;
        p.vz *= drag;
        p.vy = Math.max(p.vy * Math.exp(-dt * 0.8), -0.55);
        const sway = Math.sin(p.age * 5 + p.phase) * p.flutter;
        p.x += (p.vx + sway * 0.4) * dt;
        p.y += p.vy * dt;
        p.z += (p.vz + Math.cos(p.age * 4 + p.phase) * p.flutter * 0.3) * dt;
        p.rx += p.spin * dt;
        p.rz += p.spin * 0.7 * dt;
        const r = Math.hypot(p.x, p.z);
        const ground =
          r < FELT_RADIUS ? 0.002 : r < TABLE_RADIUS ? 0.032 : FLOOR_Y;
        if (p.y <= ground) {
          p.y = ground + Math.random() * 0.002;
          p.isLanded = true;
          // Settle flat, keep its heading.
          p.rx = -Math.PI / 2;
          p.rz = 0;
          p.life = Math.min(p.life, p.age + 1.6 + Math.random());
        }
      }
      // Shrink away at the end of its life.
      const fade = Math.min(1, (p.life - p.age) / 0.5, p.age / 0.08);
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(Math.max(0.001, fade));
      dummy.updateMatrix();
      if (alive !== i) {
        list[alive] = p;
        target.getColorAt(i, scratch);
        target.setColorAt(alive, scratch);
      }
      target.setMatrixAt(alive, dummy.matrix);
      alive++;
    }
    list.length = alive;
    target.count = alive;
    target.instanceMatrix.needsUpdate = true;
    if (target.instanceColor) target.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[PAPER, material, MAX]}
      count={0}
      visible={false}
      raycast={() => null}
      frustumCulled={false}
    />
  );
}
