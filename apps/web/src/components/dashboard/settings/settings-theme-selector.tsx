'use client';

import { cn } from '@/utils/cn';
import { themeAccentColors, themeModes } from 'config/theme';
import { Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { type ThemeAccentColors, type ThemeModes } from 'types/theme';
import { splitThemeName } from '../../../utils/themes';

const themeModeIndicatorColorVariants: { [key in ThemeModes]: {
  background: string;
  foreground: string;
  text: string;
} } = {
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
};

const themeModeLabelVariants: { [key in ThemeModes]: string } = {
  light: 'Aparência clara',
  dark: 'Aparência escura',
};

const accentColorLabelVariants: { [key in ThemeAccentColors]: string } = {
  blue: 'Azul',
  green: 'Verde',
  orange: 'Laranja',
  red: 'Vermelho',
  rose: 'Rosa',
  violet: 'Violeta',
  yellow: 'Amarelo',
  zinc: 'Zinco',
};


function ThemeModeIndicator({
  variant,
  isCurrentMode,
}: {
  variant: ThemeModes;
  isCurrentMode?: boolean;
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-lg p-4 text-left transition-colors hover:bg-accent">
      <figure
        className={cn(
          'relative h-44 w-64 rounded-md',
          themeModeIndicatorColorVariants[variant].background
        )}
      >
        <div
          className={cn(
            'absolute bottom-0 right-0 h-2/3 w-4/5 rounded-br-md rounded-tl-md p-4 text-2xl font-medium',
            themeModeIndicatorColorVariants[variant].foreground
          )}
        >
          <span className={themeModeIndicatorColorVariants[variant].text}>Aa</span>
        </div>

        {isCurrentMode && (
          <div className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground">
            <Check size={18} />
          </div>
        )}
      </figure>

      <span className="text-muted-foreground">
        {themeModeLabelVariants[variant]}
      </span>
    </div>
  );
}

function AccentColorIndicator({ color, isCurrentAccentColor }: {
  color: ThemeAccentColors;
  isCurrentAccentColor?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-3 w-40 transition-colors hover:bg-accent">
      <figure
        className={cn(
          'aspect-square w-6 rounded-full',
          `bg-${color}-500`
        )}
      >
      </figure>

      <div className='flex-1 flex items-center gap-1'>
        <span className="text-muted-foreground">{accentColorLabelVariants[color]}</span>
        {isCurrentAccentColor && (
          <span className="text-muted-foreground opacity-75 text-xs">(atual)</span>
        )}
      </div>
    </div>
  );
}

export function SettingsThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState<ThemeAccentColors>();
  const [themeMode, setThemeMode] = useState<ThemeModes>();

  useEffect(() => {
    const { mode, accentColor } = splitThemeName(theme);
    setThemeMode(mode);
    setAccentColor(accentColor);
  }, [theme, setThemeMode, setAccentColor, setTheme]);

  useEffect(() => {
    if (accentColor && themeMode) {
      setTheme(`${themeMode}-${accentColor}`);
    }
  }, [accentColor, themeMode, setTheme]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium leading-none text-secondary-foreground">
            Paleta de cor
          </h3>
          <span className="text-muted-foreground">
            Escolha o tema que mais combina com você.
          </span>
        </div>

        <div className="flex items-center gap-4">
          {themeModes.map(mappedTheme => (
            <button key={mappedTheme} onClick={() => setThemeMode(mappedTheme)}>
              <ThemeModeIndicator
                isCurrentMode={themeMode === mappedTheme}
                variant={mappedTheme as ThemeModes}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium leading-none text-secondary-foreground">
            Cor de destaque
          </h3>
          <span className="text-muted-foreground">
            Escolha o tema que mais combina com você.
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {themeAccentColors.map(mappedAccentColor => (
            <button
              type="button"
              key={mappedAccentColor}
              onClick={() => setAccentColor(mappedAccentColor)}
            >
              <AccentColorIndicator
                color={mappedAccentColor as ThemeAccentColors}
                isCurrentAccentColor={accentColor === mappedAccentColor}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
