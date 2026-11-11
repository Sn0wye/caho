'use client';

import { createContext, useContext } from 'react';
import type { Texture } from 'three';

// The room's prefiltered reflections. Three ignores a material's
// envMapIntensity when it only inherits scene.environment, so this layer's
// own materials take the map explicitly: rough cloth, wood and walls get a
// whisper of it, brass and leather the full shine.
export const EnvMapContext = createContext<Texture | null>(null);

/**
 * @example
 * const envMap = useEnvMap();
 * <meshStandardMaterial envMap={envMap} envMapIntensity={0.1} />
 */
export function useEnvMap(): Texture | null {
  return useContext(EnvMapContext);
}
