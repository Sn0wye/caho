'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface ThemeSwitcherProps {}

const themeIconVariants = {
  light: <Sun size={20} />,
  dark: <Moon size={20} />,
  system: <Laptop size={20} />
} as const;

const themeLabelVariants = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema'
} as const;

export function ThemeSwitcher({}: ThemeSwitcherProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="transparent" size="icon">
          {themeIconVariants[theme as keyof typeof themeIconVariants]}
          <span className="sr-only">Trocar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" >
        {themes.map(theme => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className="capitalize"
          >
            {themeLabelVariants[theme as keyof typeof themeLabelVariants]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
