/*** THEME COLORS ***/

export const themeColors = [
  "blue",
  "orange",
  "green",
  "red",
  "violet",
  "monochrome",
] as const;

export type ThemeColor = (typeof themeColors)[number];

export const themeColorInfo: Record<
  ThemeColor,
  { name: string; color: string }
> = {
  blue: { name: "Blue", color: "hsl(221.2 83.2% 53.3%)" },
  orange: { name: "Orange", color: "hsl(24.6 95% 53.1%)" },
  green: { name: "Green", color: "hsl(142.1 76.2% 36.3%)" },
  red: { name: "Red", color: "hsl(346.8 77.2% 49.8%)" },
  violet: { name: "Violet", color: "hsl(262.1 83.3% 57.8%)" },
  monochrome: { name: "Monochrome", color: "hsl(240 5.9% 10%)" },
} as const;
