import { ThemeColor, defaultColor, defaultSound } from "@/constants";
import { createContext, useContext } from "react";

type SettingsContextType = {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
  sound: boolean;
  setSound: (sound: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  color: defaultColor,
  setColor: () => {},
  sound: defaultSound,
  setSound: () => {},
});

export const useSettings = () => useContext(SettingsContext);
