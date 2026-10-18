'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type PointerEvent,
  type RefObject
} from 'react';
import type { CursorMessage, CursorPosition } from '@/contracts';
import { isOnTable, screenToTable, type TableView } from './table-geometry';

// 20 updates a second; the backend drops moves closer than 30ms apart.
const SEND_INTERVAL_MS = 50;

type PinCursor = (position: CursorPosition | null) => void;

const CursorPinContext = createContext<PinCursor>(() => {});

export const CursorPinProvider = CursorPinContext.Provider;

/**
 * Pins this Player's broadcast cursor to a table-space point while the pointer
 * is over something that isn't flat on the felt (a card in the Hand, a card
 * lifted toward the camera), so the others see it where it means to point.
 * Pass null when the pointer leaves it. A no-op outside the table layout.
 *
 * @example
 * const pin = useCursorPin();
 * <button onPointerMove={() => pin(pointOnCard(card, u, v))} onPointerLeave={() => pin(null)} />
 */
export function useCursorPin(): PinCursor {
  return useContext(CursorPinContext);
}

type Options = {
  sceneRef: RefObject<HTMLElement | null>;
  // Where the table's centre (and the perspective origin) sits, as a fraction of
  // the scene's height.
  centerY: number;
  view: TableView;
  send: (message: CursorMessage) => void;
};

/**
 * Turns pointer moves over the scene into table-space cursor messages,
 * throttled to SEND_INTERVAL_MS with a trailing send so the final resting
 * position always goes out. While something pins it (see useCursorPin), the
 * pinned point goes out instead of the one under the pointer.
 *
 * @example
 * const pointer = useCursorBroadcast({ sceneRef, centerY: 0.42, view, send });
 * <div onPointerMove={pointer.onPointerMove} onPointerLeave={pointer.onPointerLeave} />
 * <CursorPinProvider value={pointer.pin}>...</CursorPinProvider>
 */
export function useCursorBroadcast({ sceneRef, centerY, view, send }: Options) {
  const lastSentAt = useRef(0);
  const pending = useRef<CursorPosition | null>(null);
  const trailingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShown = useRef(false);
  const isPinned = useRef(false);

  const flush = useCallback(() => {
    trailingTimer.current = null;
    const position = pending.current;
    if (!position) return;
    pending.current = null;
    lastSentAt.current = Date.now();
    isShown.current = true;
    send({ event: 'cursor.move', payload: position });
  }, [send]);

  const queue = useCallback(
    (position: CursorPosition) => {
      pending.current = position;
      if (trailingTimer.current) return;
      const wait = SEND_INTERVAL_MS - (Date.now() - lastSentAt.current);
      if (wait <= 0) flush();
      else trailingTimer.current = setTimeout(flush, wait);
    },
    [flush]
  );

  const hide = useCallback(() => {
    isPinned.current = false;
    pending.current = null;
    if (trailingTimer.current) clearTimeout(trailingTimer.current);
    trailingTimer.current = null;
    if (!isShown.current) return;
    isShown.current = false;
    send({ event: 'cursor.hide' });
  }, [send]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const scene = sceneRef.current;
      if (!scene || event.pointerType === 'touch' || isPinned.current) return;
      const rect = scene.getBoundingClientRect();
      const position = screenToTable(
        {
          x: event.clientX - rect.left - rect.width / 2,
          y: event.clientY - rect.top - rect.height * centerY
        },
        view
      );
      if (!position || !isOnTable(position)) {
        hide();
        return;
      }
      queue(position);
    },
    [sceneRef, centerY, view, hide, queue]
  );

  // Pointer moves take over again once unpinned.
  const pin = useCallback(
    (position: CursorPosition | null) => {
      isPinned.current = position !== null;
      if (position) queue(position);
    },
    [queue]
  );

  useEffect(() => hide, [hide]);

  return { onPointerMove, onPointerLeave: hide, pin };
}
