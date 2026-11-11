'use client';

import { useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { useTable3D } from '../store';
import {
  bake,
  clamp,
  MAX_DIST,
  MAX_POLAR,
  MIN_DIST,
  MIN_POLAR,
  PAN_RADIUS,
  type Rig
} from './rig';

const ORBIT_SPEED = 0.0055;
const KEY_STEP = Math.PI / 14;

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

type Touch = { x: number; y: number };

/**
 * Right-drag orbit, wheel dolly, middle/Shift+right pan, keys and two-finger
 * touch. Left mouse and single touches belong to cards and toys.
 *
 * @example
 * useCameraControls(rigRef);
 */
export function useCameraControls(rigRef: RefObject<Rig | null>): void {
  const element = useThree(state => state.gl.domElement);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    const isBusy = () => useTable3D.getState().isDragging;

    // Any manual move hands the camera to the player.
    const takeControl = () => {
      if (useTable3D.getState().cameraView === 'free') return;
      bake(rig);
      rig.view = 'free';
      useTable3D.getState().setCameraView('free');
    };
    const orbit = (dx: number, dy: number) => {
      takeControl();
      rig.goal.az -= dx;
      rig.goal.pol = clamp(rig.goal.pol - dy, MIN_POLAR, MAX_POLAR);
    };
    const zoom = (factor: number) => {
      takeControl();
      rig.goal.dist = clamp(rig.goal.dist * factor, MIN_DIST, MAX_DIST);
    };
    const pan = (dx: number, dy: number) => {
      takeControl();
      const { goal } = rig;
      // Pixels to world units at the target's depth.
      const scale =
        (2 * goal.dist * Math.tan((38 / 2) * (Math.PI / 180))) /
        element.clientHeight;
      const rightX = Math.cos(goal.az);
      const rightZ = -Math.sin(goal.az);
      const forwardX = -Math.sin(goal.az);
      const forwardZ = -Math.cos(goal.az);
      let x = goal.x - (rightX * dx - forwardX * dy) * scale;
      let z = goal.z - (rightZ * dx - forwardZ * dy) * scale;
      const length = Math.hypot(x, z);
      if (length > PAN_RADIUS) {
        x *= PAN_RADIUS / length;
        z *= PAN_RADIUS / length;
      }
      goal.x = x;
      goal.z = z;
    };

    let mode: 'orbit' | 'pan' | null = null;
    let mouseId = -1;
    const touches = new Map<number, Touch>();
    let pinch = { cx: 0, cy: 0, gap: 0 };

    const measure = () => {
      const [a, b] = [...touches.values()];
      return {
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
        gap: Math.hypot(a.x - b.x, a.y - b.y) || 1
      };
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (touches.size === 2) pinch = measure();
        return;
      }
      if (isBusy() || mode) return;
      if (event.button === 1) mode = 'pan';
      else if (event.button === 2) mode = event.shiftKey ? 'pan' : 'orbit';
      else return;
      event.preventDefault();
      mouseId = event.pointerId;
      element.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        const touch = touches.get(event.pointerId);
        if (!touch) return;
        touch.x = event.clientX;
        touch.y = event.clientY;
        if (touches.size !== 2 || isBusy()) return;
        const next = measure();
        orbit(
          (next.cx - pinch.cx) * ORBIT_SPEED,
          (next.cy - pinch.cy) * ORBIT_SPEED
        );
        zoom(pinch.gap / next.gap);
        pinch = next;
        return;
      }
      if (!mode || event.pointerId !== mouseId || isBusy()) return;
      if (mode === 'orbit') {
        orbit(event.movementX * ORBIT_SPEED, event.movementY * ORBIT_SPEED);
      } else pan(event.movementX, event.movementY);
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        touches.delete(event.pointerId);
        if (touches.size === 2) pinch = measure();
      } else if (event.pointerId === mouseId) {
        mode = null;
        mouseId = -1;
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isBusy()) return;
      const lines = event.deltaMode === 1 ? 16 : 1;
      zoom(Math.exp(clamp(event.deltaY * lines, -120, 120) * 0.0014));
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;
      const { cameraView, setCameraView } = useTable3D.getState();
      const key = event.key.toLowerCase();
      if (key === ' ' || key === 'spacebar') {
        event.preventDefault();
        if (cameraView !== 'seat') setCameraView('seat');
      } else if (key === 't') {
        if (cameraView !== 'top') setCameraView('top');
      } else if (key === 'q' || key === 'arrowleft') {
        event.preventDefault();
        orbit(-KEY_STEP, 0);
      } else if (key === 'e' || key === 'arrowright') {
        event.preventDefault();
        orbit(KEY_STEP, 0);
      } else if (key === 'arrowup') {
        event.preventDefault();
        orbit(0, KEY_STEP * 0.6);
      } else if (key === 'arrowdown') {
        event.preventDefault();
        orbit(0, -KEY_STEP * 0.6);
      }
    };

    element.addEventListener('pointerdown', onDown);
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerup', onUp);
    element.addEventListener('pointercancel', onUp);
    element.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      element.removeEventListener('pointerdown', onDown);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerup', onUp);
      element.removeEventListener('pointercancel', onUp);
      element.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [element, rigRef]);
}
