'use client';

import { Box, Layers, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  GAME_LAYOUTS,
  useGameLayout,
  type GameLayout
} from '../table/use-game-layout';

const LAYOUTS: Record<GameLayout, { label: string; icon: typeof Box }> = {
  '3d': { label: 'Mesa 3D', icon: Box },
  'table': { label: 'Mesa 2.5D com cursores', icon: Layers },
  'classic': { label: 'Layout clássico', icon: LayoutGrid }
};

// Cycles through the 3D table, the 2.5D table and the classic flat layout.
export function GameLayoutToggle() {
  const { layout, setLayout } = useGameLayout();
  const next =
    GAME_LAYOUTS[(GAME_LAYOUTS.indexOf(layout) + 1) % GAME_LAYOUTS.length];
  const Icon = LAYOUTS[next].icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Usar ${LAYOUTS[next].label}`}
          onClick={() => setLayout(next)}
        >
          <Icon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{LAYOUTS[next].label}</TooltipContent>
    </Tooltip>
  );
}
