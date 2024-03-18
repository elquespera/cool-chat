import { ThemeColor, defaultColor } from "@/constants";
import { createContext, useContext } from "react";

type ColorContextType = {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
};

export const ColorContext = createContext<ColorContextType>({
  color: defaultColor,
  setColor: () => {},
});

export const useColors = () => useContext(ColorContext);
