/*** THEME BACKGROUNDS ***/

export const themeBackgrounds = [
  "solid",
  "circuit-board",
  "bathroom-floor",
  "tic-tac-toe",
  "i-like-food",
] as const;

export type ThemeBackground = (typeof themeBackgrounds)[number];

export const themeBackgroundInfo: Record<ThemeBackground, { name: string }> = {
  solid: { name: "No fill" },
  "circuit-board": { name: "Circuit Board" },
  "bathroom-floor": { name: "Bathroom Floor" },
  "tic-tac-toe": { name: "Tic Tac Toe" },
  "i-like-food": { name: "I like Food" },
} as const;
