import { type ThemeAccentColors, type ThemeModes } from "types/theme";

function splitThemeName(themeName): { mode: ThemeModes; accentColor: ThemeAccentColors } {
  const [mode, accentColor] = themeName.split("-");
  return { mode, accentColor };
}

export { splitThemeName };
