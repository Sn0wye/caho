'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Plane, Raycaster, Vector2, Vector3 } from 'three';
import type { CursorPosition } from '@/contracts';
import { useGame } from '@/hooks/game';
import { isOnTable } from '../../table/table-geometry';
import { worldToTable } from '../space';
import { useTable3D } from '../store';

// 20 updates a second; the backend drops moves closer than 30ms apart.
const SEND_INTERVAL_MS = 50;

const FELT = new Plane(new Vector3(0, 1, 0), 0);

/**
 * Sends this Player's pointer to the others, in table space: the felt point
 * under it, or the cards layer's pin while the pointer is on a Hand card or a
 * lifted answer. Throttled with a trailing send, like the 2.5D table's
 * useCursorBroadcast. Renders nothing.
 *
 * @example
 * <CursorBroadcast />
 */
export function CursorBroadcast() {
  const { sendCursor } = useGame();
  const gl = useThree(state => state.gl);
  const get = useThree(state => state.get);
  const send = useRef(sendCursor);
  useEffect(() => {
    send.current = sendCursor;
  }, [sendCursor]);

  useEffect(() => {
    const element = gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const hit = new Vector3();
    let lastSentAt = 0;
    let pending: CursorPosition | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let isShown = false;

    const flush = () => {
      timer = null;
      // The pin wins: it is where the pointer means to point.
      const position = useTable3D.getState().cursorPin ?? pending;
      pending = null;
      if (!position) return;
      lastSentAt = Date.now();
      isShown = true;
      send.current({ event: 'cursor.move', payload: position });
    };

    const queue = (position: CursorPosition) => {
      pending = position;
      if (timer) return;
      const wait = SEND_INTERVAL_MS - (Date.now() - lastSentAt);
      if (wait <= 0) flush();
      else timer = setTimeout(flush, wait);
    };

    const hide = () => {
      pending = null;
      if (timer) clearTimeout(timer);
      timer = null;
      if (!isShown) return;
      isShown = false;
      send.current({ event: 'cursor.hide' });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const pin = useTable3D.getState().cursorPin;
      if (pin) {
        queue(pin);
        return;
      }
      const rect = element.getBoundingClientRect();
      ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, get().camera);
      const point = raycaster.ray.intersectPlane(FELT, hit)
        ? worldToTable(hit)
        : null;
      if (!point || !isOnTable(point)) hide();
      else queue(point);
    };

    // The pin can change without the pointer moving (a card flies under it).
    const unsubscribe = useTable3D.subscribe((state, previous) => {
      if (state.cursorPin && state.cursorPin !== previous.cursorPin) {
        queue(state.cursorPin);
      }
    });

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', hide);
    return () => {
      unsubscribe();
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', hide);
      hide();
    };
  }, [gl, get]);

  return null;
}
