'use client';

import { useEffect } from 'react';
import { fx, useTable3D } from '../store';
import { createEngine } from './engine';

declare global {
  interface Window {
    __cahoSoundCheck?: () => Promise<unknown>;
    __cahoSound?: () => unknown;
  }
}

// Renders nothing: owns the audio engine, which wakes on the first gesture.
export default function Sound() {
  useEffect(() => {
    // A fresh engine per mount, so StrictMode's mount/unmount/mount is safe:
    // the AudioContext only exists once a gesture (or a prior one) allows it.
    const engine = createEngine();
    engine.setMuted(useTable3D.getState().isMuted);
    const unlock = () => {
      engine.unlock();
      if (engine.isUnlocked()) removeGestureListeners();
    };
    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    // The Player may already have interacted before this layer mounted.
    if (navigator.userActivation?.hasBeenActive) engine.unlock();

    const offFx = fx.on(event => engine.play(event));
    const offMute = useTable3D.subscribe(state =>
      engine.setMuted(state.isMuted)
    );

    if (process.env.NODE_ENV !== 'production') {
      window.__cahoSound = () => ({ ...engine.stats });
      window.__cahoSoundCheck = async () => {
        const { runSoundCheck } = await import('./check');
        return runSoundCheck();
      };
    }

    return () => {
      removeGestureListeners();
      offFx();
      offMute();
      engine.dispose();
    };
  }, []);

  return null;
}
