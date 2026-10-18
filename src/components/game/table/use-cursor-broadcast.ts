'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent,
  type RefObject
} from 'react';
import type { CursorMessage, CursorPosition } from '@/contracts';
import { isOnTable, screenToTable, type TableView } from './table-geometry';

// 20 updates a second; the backend drops moves closer than 30ms apart.
const SEND_INTERVAL_MS = 50;

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
 * position always goes out. While the pointer rests on a card of this Player's
 * Hand, `hoverCard` pins the cursor to that card on the table instead.
 *
 * @example
 * const pointer = useCursorBroadcast({ sceneRef, centerY: 0.42, view, send });
 * <div onPointerMove={pointer.onPointerMove} onPointerLeave={pointer.onPointerLeave} />
 * <Card onPointerEnter={() => pointer.hoverCard(2, slotPosition)} />
 */
export function useCursorBroadcast({ sceneRef, centerY, view, send }: Options) {
  const lastSentAt = useRef(0);
  const pending = useRef<CursorPosition | null>(null);
  const trailingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShown = useRef(false);
  const isHoveringCard = useRef(false);

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
    isHoveringCard.current = false;
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
      if (!scene || event.pointerType === 'touch' || isHoveringCard.current)
        return;
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

  // `position` is where the card lies on the table; null when the pointer
  // leaves the card, after which pointer moves take over again.
  const hoverCard = useCallback(
    (card: number | null, position?: CursorPosition) => {
      isHoveringCard.current = card !== null;
      if (card !== null && position) queue({ ...position, card });
    },
    [queue]
  );

  useEffect(() => hide, [hide]);

  return { onPointerMove, onPointerLeave: hide, hoverCard };
}
