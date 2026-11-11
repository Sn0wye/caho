'use client';

import {
  Component,
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type ReactNode
} from 'react';
import { Canvas } from '@react-three/fiber';
import { useJudgePick } from '../round/use-judge-pick';
import {
  CAMERA_DISTANCE,
  CAMERA_FOV,
  CAMERA_HEIGHT,
  CAMERA_TARGET_OFFSET
} from './space';
import { JudgeProvider, useGameFx, useSeats } from './use-table';

// Each layer is its own chunk behind its own error boundary, so one broken
// layer never takes the table down with it. See README.md for who owns what.
const Environment3D = lazy(() => import('./scene/environment'));
const PostFx = lazy(() => import('./scene/post-fx'));
const Cards3D = lazy(() => import('./cards/cards-3d'));
const Players3D = lazy(() => import('./players/players-3d'));
const CameraRig = lazy(() => import('./camera/camera-rig'));
const Toys3D = lazy(() => import('./toys/toys-3d'));
const Hud = lazy(() => import('./hud/hud'));
const Sound = lazy(() => import('./audio/sound'));

type LayerName =
  | 'env'
  | 'postfx'
  | 'cards'
  | 'players'
  | 'camera'
  | 'toys'
  | 'hud'
  | 'sound';

/**
 * The WebGL table: one scene for the whole Room, from lobby to podium.
 * `?layers=env,cards` in the URL mounts only those layers (for debugging).
 *
 * @example
 * <GameContextProvider ...><Table3D /></GameContextProvider>
 */
export function Table3D() {
  const judge = useJudgePick();
  const { self } = useSeats();
  useGameFx();

  const enabled = useMemo(() => {
    const only = new URLSearchParams(window.location.search).get('layers');
    return only ? new Set(only.split(',')) : null;
  }, []);
  const layer = (name: LayerName, Layer: ComponentType) =>
    !enabled || enabled.has(name) ? (
      <LayerBoundary name={name}>
        <Suspense fallback={null}>
          <Layer />
        </Suspense>
      </LayerBoundary>
    ) : null;

  // Where the camera starts, before the rig takes over: seated at this
  // Player's place.
  const direction = self?.direction ?? { x: 0, y: 1 };

  return (
    <JudgeProvider value={judge}>
      <main
        data-testid="table-3d"
        className="relative min-h-0 w-full flex-1 overflow-hidden bg-[#07060a] select-none"
        onContextMenu={event => event.preventDefault()}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{
            fov: CAMERA_FOV,
            near: 0.05,
            far: 60,
            position: [
              direction.x * CAMERA_DISTANCE,
              CAMERA_HEIGHT,
              direction.y * CAMERA_DISTANCE
            ]
          }}
          onCreated={({ camera }) =>
            camera.lookAt(
              direction.x * CAMERA_TARGET_OFFSET,
              0,
              direction.y * CAMERA_TARGET_OFFSET
            )
          }
        >
          {layer('env', Environment3D)}
          {layer('players', Players3D)}
          {layer('cards', Cards3D)}
          {layer('toys', Toys3D)}
          {layer('camera', CameraRig)}
          {layer('postfx', PostFx)}
        </Canvas>
        {layer('hud', Hud)}
        {layer('sound', Sound)}
      </main>
    </JudgeProvider>
  );
}

type LayerBoundaryProps = { name: string; children: ReactNode };

class LayerBoundary extends Component<LayerBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[table3d] layer "${this.props.name}" crashed`, error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
