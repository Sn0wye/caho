const themeModes = ["light", "dark"] as const;
const themeAccentColors = ["zinc", "red", "orange", "green", "blue", "yellow", "violet", "rose", "dracula", "ocean", "nord"] as const;

const availableThemes = themeModes.reduce((acc, mode) => {
  themeAccentColors.forEach((color) => {
    acc.push(`${mode}-${color}`);
  });
  return acc;
}, [] as string[]);

export { availableThemes, themeAccentColors, themeModes };

