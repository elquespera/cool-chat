import { defaultSettings } from "@/constants";
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
  resizeAttachments: boolean;
  setResizeAttachments: (sound: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setColor: () => {},
  setBackground: () => {},
  setSound: () => {},
  setResizeAttachments: () => {},
});

export const useSettings = () => useContext(SettingsContext);
