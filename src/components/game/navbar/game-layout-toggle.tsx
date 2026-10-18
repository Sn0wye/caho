'use client';

import { Box, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useGameLayout } from '../table/use-game-layout';

// Switches between the 2.5D table and the classic flat layout.
export function GameLayoutToggle() {
  const { layout, setLayout } = useGameLayout();
  const isTable = layout === 'table';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={isTable ? 'Usar layout clássico' : 'Usar layout de mesa'}
          onClick={() => setLayout(isTable ? 'classic' : 'table')}
        >
          {isTable ? <LayoutGrid size={16} /> : <Box size={16} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isTable ? 'Layout clássico' : 'Mesa 3D com cursores'}
      </TooltipContent>
    </Tooltip>
  );
}
