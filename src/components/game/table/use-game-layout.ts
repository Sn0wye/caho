'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

// '3d' is the WebGL table (components/game/table3d), 'table' the 2.5D CSS one.
export type GameLayout = '3d' | 'table' | 'classic';

export const GAME_LAYOUTS: GameLayout[] = ['3d', 'table', 'classic'];

const STORAGE_KEY = 'caho:game-layout';

type GameLayoutStore = {
  layout: GameLayout;
  setLayout: (layout: GameLayout) => void;
};

export const useGameLayout = create<GameLayoutStore>(set => ({
  layout: '3d',
  setLayout: layout => {
    localStorage.setItem(STORAGE_KEY, layout);
    set({ layout });
  }
}));

// Read the saved choice after hydration; reading it during render would make
// the server HTML (always the default) disagree with the client's first render.
export function useRestoreGameLayout() {
  useEffect(() => {
    const saved = GAME_LAYOUTS.find(
      layout => layout === localStorage.getItem(STORAGE_KEY)
    );
    if (saved) useGameLayout.setState({ layout: saved });
  }, []);
}
