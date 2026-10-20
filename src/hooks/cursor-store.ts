import type { CursorPosition } from '@/contracts';

export type CursorPositions = ReadonlyMap<string, CursorPosition>;

/**
 * Other Players' live cursors, kept outside the game reducer: they change up to
 * 20 times a second per Player, and only the cursor layer should re-render.
 * Read it with `useSyncExternalStore(store.subscribe, store.snapshot)`.
 *
 * @example
 * const store = new CursorStore();
 * store.move('player-a', { x: 0, y: 0.5 });
 * store.snapshot().get('player-a'); // { x: 0, y: 0.5 }
 */
export class CursorStore {
  private positions: CursorPositions = new Map();
  private readonly listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  snapshot = (): CursorPositions => this.positions;

  move(playerId: string, position: CursorPosition) {
    this.positions = new Map(this.positions).set(playerId, position);
    this.notify();
  }

  remove(playerId: string) {
    if (!this.positions.has(playerId)) return;
    const next = new Map(this.positions);
    next.delete(playerId);
    this.positions = next;
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }
}
