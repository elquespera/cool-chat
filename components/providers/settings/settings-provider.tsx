"use client";

import { ThemeColor, defaultColor, themeColors } from "@/constants";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { SettingsContext } from "./settings-context";

export type InitialSettings = {
  color: ThemeColor;
  sound: boolean;
};

type SettingsProviderProps = {
  initialSettings: InitialSettings;
} & PropsWithChildren;

export function SettingsProvider({
  initialSettings,
  children,
}: SettingsProviderProps) {
  const [color, setColorInternal] = useState<ThemeColor>(initialSettings.color);
  const [sound, setSound] = useState(initialSettings.sound);

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

  const value = useMemo(
    () => ({
      color,
      setColor,
      sound,
      setSound,
    }),
    [color, sound],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
