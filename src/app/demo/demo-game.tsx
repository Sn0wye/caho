'use client';

import { useEffect } from 'react';
import {
  useGameLayout,
  type GameLayout
} from '@/components/game/table/use-game-layout';
import { DemoGameProvider } from '@/hooks/demo-game';
import type { DemoOptions } from '@/hooks/demo-room';
import { Game } from '../(protected)/room/[roomCode]/game';

type DemoGameProps = {
  options: DemoOptions;
  layout: string | null;
};

const LAYOUTS: GameLayout[] = ['3d', 'table', 'classic'];

export function DemoGame({ options, layout }: DemoGameProps) {
  useEffect(() => {
    const forced = LAYOUTS.find(candidate => candidate === layout);
    if (forced) useGameLayout.setState({ layout: forced });
  }, [layout]);

  return (
    <DemoGameProvider options={options}>
      <Game />
    </DemoGameProvider>
  );
}
