/*** AUTH ***/
export const redirectURIKey = "redirectURI";
export const authMessageKey = "message";
export const userIdLength = 15;
export const emailMatcher = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordMatcher =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

/*** THEME COLORS ***/
export const themeColors = {
  red: { name: "Red", color: "hsl(346.8 77.2% 49.8%)" },
  orange: { name: "Orange", color: "hsl(24.6 95% 53.1%)" },
  green: { name: "Green", color: "hsl(142.1 76.2% 36.3%)" },
  blue: { name: "Blue", color: "hsl(221.2 83.2% 53.3%)" },
  violet: { name: "Violet", color: "hsl(262.1 83.3% 57.8%)" },
} as const;

export type ThemeColor = (keyof typeof themeColors)[number];

export const colorKey = "theme-color";
export const defaultColor = "blue";
