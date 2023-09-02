'use client';

import { type ComponentProps } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ThemeVariants } from 'types/theme';
import { cn } from '@/utils/cn';

interface SettingsThemeSelectorProps {}

export function SettingsThemeSelector({}: SettingsThemeSelectorProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {themes.map(mappedTheme => (
        <SettingsThemeSelectorButton
          key={mappedTheme}
          isCurrentTheme={theme === mappedTheme}
          onClick={() => setTheme(mappedTheme)}
          variant={mappedTheme as ThemeVariants}
        />
      ))}
    </div>
  );
}

export function SettingsThemeSelectorCheckIndicator() {
  return (
    <div className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-geist-orange p-2 text-white">
      <Check size={18} />
    </div>
  );
}

type ThemeButtonColorVariant = {
  background: string;
  foreground: string;
  text: string;
};

type ThemeButtonColorVariants = {
  [key in ThemeVariants]: ThemeButtonColorVariant;
};

const themeButtonColorVariants: ThemeButtonColorVariants = {
  light: {
    background: 'bg-zinc-200',
    foreground: 'bg-white',
    text: 'text-zinc-900'
  },
  dark: {
    background: 'bg-zinc-900',
    foreground: 'bg-zinc-950',
    text: 'text-zinc-50'
  },
  system: {
    background:
      'bg-gradient-to-r from-zinc-200 from-50% via-zinc-900 via-50% to-zinc-900',
    foreground:
      'bg-gradient-to-r from-white from-[37.5%] via-zinc-950 via-[37.5%] to-zinc-950',
    text: 'text-zinc-900'
  }
};

const themeLabelVariants: { [key in ThemeVariants]: string } = {
  light: 'Tema claro',
  dark: 'Tema escuro',
  system: 'Tema do sistema'
};

type SettingsThemeSelectorButtonProps = ComponentProps<'button'> & {
  variant: ThemeVariants;
  isCurrentTheme?: boolean;
};

export function SettingsThemeSelectorButton({
  variant,
  isCurrentTheme,
  ...props
}: SettingsThemeSelectorButtonProps) {
  return (
    <button
      type="button"
      className="group flex flex-col gap-3 rounded-lg p-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/20"
      {...props}
    >
      <figure
        className={cn(
          'relative h-44 w-64 rounded-md',
          themeButtonColorVariants[variant].background
        )}
      >
        <div
          className={cn(
            'absolute bottom-0 right-0 h-2/3 w-4/5 rounded-br-md rounded-tl-md p-4 text-2xl font-medium',
            themeButtonColorVariants[variant].foreground
          )}
        >
          <span className={themeButtonColorVariants[variant].text}>Aa</span>
        </div>

        {isCurrentTheme && <SettingsThemeSelectorCheckIndicator />}
      </figure>

      <span className="text-zinc-500 transition-colors group-hover:text-zinc-700 group-hover:dark:text-zinc-300">
        {themeLabelVariants[variant]}
      </span>
    </button>
  );
}
