"use client";

import { ThemeColor, defaultColor, themeColors } from "@/constants";
import { PropsWithChildren, useEffect, useState } from "react";
import { SettingsContext } from "./settings-context";

export type InitialSettings = {
  color: ThemeColor;
};

type SettingsProviderProps = {
  initialSettings: InitialSettings;
} & PropsWithChildren;

export function SettingsProvider({
  initialSettings,
  children,
}: SettingsProviderProps) {
  const [color, setColorInternal] = useState<ThemeColor>(initialSettings.color);

  const updateColorClass = (value: ThemeColor) => {
    themeColors.forEach((themeColor) =>
      document.documentElement.classList.toggle(
        themeColor,
        value === themeColor,
      ),
    );
  };

  const setColor = (value: ThemeColor) => {
    const newValue = value || color || defaultColor;
    setColorInternal(newValue || defaultColor);
    updateColorClass(newValue);
  };

  useEffect(() => updateColorClass(initialSettings.color), [initialSettings]);

  return (
    <SettingsContext.Provider value={{ color, setColor }}>
      {children}
    </SettingsContext.Provider>
  );
}
