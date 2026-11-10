'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CursorMessage, PlayerEvent, RoomEvent } from '@/contracts';
import { env } from '@/env.mjs';

// Keeps proxies from reaping an idle socket; the backend ignores the payload.
const KEEPALIVE_INTERVAL_MS = 30 * 1000;
const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 10 * 1000;
// The backend closes with 1008 when the session cookie is missing or the
// Player channel isn't ours; retrying can't fix that.
const WS_POLICY_VIOLATION = 1008;

export type SocketStatus = 'connecting' | 'open' | 'reconnecting' | 'rejected';

type Options = {
  roomCode: string;
  userId: string;
  onEvent: (event: RoomEvent | PlayerEvent) => void;
  // Fired each time the Room socket opens, so the caller can catch up on events
  // missed before the first connect or while offline.
  onOpen: () => void;
};

type Channel = {
  url: string;
  socket: WebSocket | null;
  attempts: number;
  retryTimer: ReturnType<typeof setTimeout> | null;
  keepaliveTimer: ReturnType<typeof setInterval> | null;
};

// Two sockets per Room: the Room channel (`room.*`) and the private Player
// channel (`player.*`, which also drives presence). Both reconnect with backoff.
// The Room socket also carries this Player's cursor out (backend ADR-0006).
export function useRoomSockets({ roomCode, userId, onEvent, onOpen }: Options) {
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const handlers = useRef({ onEvent, onOpen });
  handlers.current = { onEvent, onOpen };
  const roomSocket = useRef<WebSocket | null>(null);

  // Dropped while the socket is down: a stale cursor is worthless, and the next
  // move after reconnecting replaces it.
  const sendCursor = useCallback((message: CursorMessage) => {
    const socket = roomSocket.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    const openState = { room: false, player: false };
    const room = makeChannel(
      `${env.NEXT_PUBLIC_WEBSOCKET_URL}/room/${roomCode}`
    );
    const player = makeChannel(`${env.NEXT_PUBLIC_WEBSOCKET_URL}/${userId}`);

    const refreshStatus = () => {
      if (openState.room && openState.player) {
        setStatus('open');
      }
    };

    const connect = (channel: Channel, key: keyof typeof openState) => {
      if (disposed) return;

      const socket = new WebSocket(channel.url);
      channel.socket = socket;
      if (key === 'room') roomSocket.current = socket;

      socket.onopen = () => {
        channel.attempts = 0;
        openState[key] = true;
        channel.keepaliveTimer = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send('ping');
        }, KEEPALIVE_INTERVAL_MS);
        refreshStatus();
        if (key === 'room') handlers.current.onOpen();
      };

      socket.onmessage = message => {
        const parsed = parseEvent(message.data);
        if (parsed) handlers.current.onEvent(parsed);
      };

      socket.onclose = closeEvent => {
        openState[key] = false;
        clearChannelTimers(channel);
        if (disposed) return;

        if (closeEvent.code === WS_POLICY_VIOLATION) {
          setStatus('rejected');
          return;
        }

        setStatus('reconnecting');
        const delay = Math.min(
          RECONNECT_BASE_DELAY_MS * 2 ** channel.attempts,
          RECONNECT_MAX_DELAY_MS
        );
        channel.attempts += 1;
        channel.retryTimer = setTimeout(() => connect(channel, key), delay);
      };
    };

    // Deferred so React StrictMode's mount → unmount → mount in dev cancels the
    // first attempt instead of opening and instantly closing a socket, which the
    // backend would read as the Player dropping.
    const startTimer = setTimeout(() => {
      connect(room, 'room');
      connect(player, 'player');
    }, 0);

    return () => {
      disposed = true;
      clearTimeout(startTimer);
      closeChannel(room);
      closeChannel(player);
    };
  }, [roomCode, userId]);

  return { status, sendCursor };
}

function makeChannel(url: string): Channel {
  return {
    url,
    socket: null,
    attempts: 0,
    retryTimer: null,
    keepaliveTimer: null
  };
}

function clearChannelTimers(channel: Channel) {
  if (channel.retryTimer) clearTimeout(channel.retryTimer);
  if (channel.keepaliveTimer) clearInterval(channel.keepaliveTimer);
  channel.retryTimer = null;
  channel.keepaliveTimer = null;
}

function closeChannel(channel: Channel) {
  clearChannelTimers(channel);
  channel.socket?.close();
  channel.socket = null;
}

function parseEvent(raw: unknown): RoomEvent | PlayerEvent | null {
  if (typeof raw !== 'string') return null;

  try {
    const data = JSON.parse(raw);
    if (data && typeof data.event === 'string') {
      return data as RoomEvent | PlayerEvent;
    }
  } catch {
    // Not an event (e.g. a keepalive echo); ignore it.
  }

  return null;
}
