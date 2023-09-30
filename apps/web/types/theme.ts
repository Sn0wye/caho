import { type themeAccentColors, type themeModes } from "config/theme";

export type ThemeModes = typeof themeModes[number];
export type ThemeAccentColors = typeof themeAccentColors[number];

export type Themes = `${ThemeModes}-${ThemeAccentColors}`; 