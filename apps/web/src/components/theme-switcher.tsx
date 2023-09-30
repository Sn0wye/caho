'use client';

import { SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type ThemeSwitcherProps = {
  tooltipSide?: 'left' | 'right' | 'bottom' | 'top' | undefined;
};

export function ThemeSwitcher({ tooltipSide = 'right' }: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <SunIcon className="h-4 w-4" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {themes.map(theme => (
            <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
              {theme}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side={tooltipSide} sideOffset={4}>
        <span>Toggle theme</span>
      </TooltipContent>
    </Tooltip>
  );
}
