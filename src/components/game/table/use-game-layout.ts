'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

export type GameLayout = 'table' | 'classic';

const STORAGE_KEY = 'caho:game-layout';

type GameLayoutStore = {
  layout: GameLayout;
  setLayout: (layout: GameLayout) => void;
};

export const useGameLayout = create<GameLayoutStore>(set => ({
  layout: 'table',
  setLayout: layout => {
    localStorage.setItem(STORAGE_KEY, layout);
    set({ layout });
  }
}));

// Read the saved choice after hydration; reading it during render would make
// the server HTML (always 'table') disagree with the client's first render.
export function useRestoreGameLayout() {
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'table' || saved === 'classic') {
      useGameLayout.setState({ layout: saved });
    }
  }, []);
}
