import { ThemeColor, defaultColor } from "@/constants";
import { createContext, useContext } from "react";

type SettingsContextType = {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  color: defaultColor,
  setColor: () => {},
});

export const useSettings = () => useContext(SettingsContext);
