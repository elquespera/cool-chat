"use client";

import { ThemeColor, themeColors } from "@/constants/theme-color";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { SettingsContext } from "./settings-context";
import { defaultSettings } from "@/constants";
import { ThemeBackground } from "@/constants/theme-background";

export type InitialSettings = {
  color: ThemeColor;
  background: ThemeBackground;
  sound: boolean;
  resizeAttachments: boolean;
};

type SettingsProviderProps = {
  initialSettings: InitialSettings;
} & PropsWithChildren;

export function SettingsProvider({
  initialSettings,
  children,
}: SettingsProviderProps) {
  const [color, setColor] = useState<ThemeColor>(initialSettings.color);
  const [background, setBackground] = useState<ThemeBackground>(
    initialSettings.background,
  );
  const [sound, setSound] = useState(initialSettings.sound);
  const [resizeAttachments, setResizeAttachments] = useState(
    initialSettings.resizeAttachments,
  );

  const updateColorClass = (value: ThemeColor) => {
    themeColors.forEach((themeColor) =>
      document.documentElement.classList.toggle(
        themeColor,
        value === themeColor,
      ),
    );
  };

  useEffect(() => updateColorClass(initialSettings.color), [initialSettings]);

  const value = useMemo(
    () => ({
      color,
      setColor: (value: ThemeColor) => {
        const newValue = value || color || defaultSettings.color;
        setColor(newValue);
        updateColorClass(newValue);
      },
      background,
      setBackground: (value: ThemeBackground) => {
        const newValue = value || background || defaultSettings.background;
        setBackground(newValue);
      },
      sound,
      setSound,
      resizeAttachments,
      setResizeAttachments,
    }),
    [color, background, sound, resizeAttachments],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
