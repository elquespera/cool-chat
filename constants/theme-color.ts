/*** THEME COLORS ***/

export const themeColors = [
  "picton-blue",
  "monochrome",
  "pigment-green",
  "blue-violet",
  "pumpkin",
  "rose",
] as const;

export type ThemeColor = (typeof themeColors)[number];

export const themeColorInfo: Record<
  ThemeColor,
  { name: string; color: string }
> = {
  "picton-blue": { name: "Picton Blue", color: "hsl(200,68%,51%)" },
  monochrome: { name: "Monochrome", color: "hsl(240 5.9% 10%)" },
  "pigment-green": { name: "Pigment Green", color: "hsl(142.1 76.2% 36.3%)" },
  "blue-violet": { name: "Blue Violet", color: "hsl(262.1 83.3% 57.8%)" }, //#7C3AED
  rose: { name: "Rose", color: "hsl(346.8 77.2% 49.8%)" },
  pumpkin: { name: "Pumpkin", color: "hsl(24.6 95% 53.1%)" },
} as const;
