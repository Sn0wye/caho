'use client';

import { create } from 'zustand';
import type { CursorPosition } from '@/contracts';
import type { Vec3 } from './space';

// What the 3D table's layers share besides the game itself. Layers never import
// each other; they meet here and in `useGame()`.

export type CameraView = 'seat' | 'top' | 'free';

type Table3DStore = {
  // The answer (index into the sorted answers) under this Player's pointer.
  hoveredAnswer: number | null;
  setHoveredAnswer: (index: number | null) => void;
  // Overrides the broadcast cursor while the pointer is on something that
  // isn't flat on the felt (a Hand card, a lifted answer). See CursorBroadcast.
  cursorPin: CursorPosition | null;
  setCursorPin: (pin: CursorPosition | null) => void;
  // True while something is being dragged (a card, a toy): the camera must not
  // move with the pointer.
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
  // The view the camera should hold. 'free' once the Player orbits by hand.
  cameraView: CameraView;
  setCameraView: (view: CameraView) => void;
  isMuted: boolean;
  toggleMuted: () => void;
};

const MUTED_KEY = 'caho:table3d-muted';

export const useTable3D = create<Table3DStore>(set => ({
  hoveredAnswer: null,
  setHoveredAnswer: hoveredAnswer => set({ hoveredAnswer }),
  cursorPin: null,
  setCursorPin: cursorPin => set({ cursorPin }),
  isDragging: false,
  setDragging: isDragging => set({ isDragging }),
  cameraView: 'seat',
  setCameraView: cameraView => set({ cameraView }),
  isMuted:
    typeof localStorage !== 'undefined' &&
    localStorage.getItem(MUTED_KEY) === '1',
  toggleMuted: () =>
    set(state => {
      localStorage.setItem(MUTED_KEY, state.isMuted ? '0' : '1');
      return { isMuted: !state.isMuted };
    })
}));

// One-shot moments, for sound and particles. Not state: nothing replays them.
export type FxEvent =
  // Cards, emitted by the cards layer where the card is.
  | { type: 'card-deal'; at?: Vec3 }
  | { type: 'card-slide'; at?: Vec3 }
  | { type: 'card-flip'; at?: Vec3 }
  | { type: 'card-hover'; at?: Vec3 }
  | { type: 'card-select'; at?: Vec3 }
  // Toys, emitted by the physics layer; `strength` 0 to 1.
  | {
      type: 'toy-hit';
      toy: 'die' | 'chip' | 'duck';
      strength: number;
      at?: Vec3;
    }
  | { type: 'toy-grab' }
  // The game, emitted by useGameFx from state changes.
  | { type: 'player-join'; playerId: string }
  | { type: 'player-ready'; playerId: string }
  | { type: 'game-start' }
  | { type: 'round-start' }
  | { type: 'player-played'; playerId: string }
  | { type: 'judging-start' }
  | { type: 'round-won'; playerId: string; isSelf: boolean }
  | { type: 'round-aborted' }
  | { type: 'game-end'; isSelfWinner: boolean }
  | { type: 'ui-click' };

type FxListener = (event: FxEvent) => void;

const listeners = new Set<FxListener>();

/**
 * @example
 * fx.emit({ type: 'card-flip', at: [0, 0.1, 0] });
 * useEffect(() => fx.on(event => event.type === 'round-won' && burst()), []);
 */
export const fx = {
  emit(event: FxEvent) {
    for (const listener of listeners) listener(event);
  },
  on(listener: FxListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
