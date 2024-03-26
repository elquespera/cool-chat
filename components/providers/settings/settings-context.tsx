import { defaultBackground, defaultColor, defaultSound } from "@/constants";
import { ThemeBackground } from "@/constants/theme-background";
import { ThemeColor } from "@/constants/theme-color";
import { createContext, useContext } from "react";

type SettingsContextType = {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
  background: ThemeBackground;
  setBackground: (background: ThemeBackground) => void;
  sound: boolean;
  setSound: (sound: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  color: defaultColor,
  setColor: () => {},
  background: defaultBackground,
  setBackground: () => {},
  sound: defaultSound,
  setSound: () => {},
});

export const useSettings = () => useContext(SettingsContext);
