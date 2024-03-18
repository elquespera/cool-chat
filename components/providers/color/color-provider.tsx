"use client";

import { ThemeColor, colorKey, defaultColor, themeColors } from "@/constants";
import { PropsWithChildren, useEffect, useState } from "react";
import { ColorContext } from "./color-context";

export function ColorProvider({ children }: PropsWithChildren) {
  const [color, setColorInternal] = useState<ThemeColor>(defaultColor);

  const setColor = (color: ThemeColor) => {
    setColorInternal(color);
    localStorage.setItem(colorKey, color);

    Object.keys(themeColors).forEach((themeColor) =>
      document.documentElement.classList.toggle(
        themeColor,
        color === themeColor,
      ),
    );
  };

  useEffect(() => {
    const storedColor = localStorage.getItem(colorKey) || defaultColor;
    setColorInternal(storedColor as ThemeColor);
  }, []);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}
