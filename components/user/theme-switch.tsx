"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { SunIcon } from "../icons/sun-icon";
import { MoonIcon } from "../icons/moon-icon";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";

type ThemeSwitchProps = ComponentProps<typeof IconButton>;

export default function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const playSound = useSoundEffect("click");

  const handleClick = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
    playSound();
  };

  useEffect(() => setMounted(true), []);

  const hint = resolvedTheme === "dark" ? "Dark theme" : "Light theme";

  return (
    <IconButton
      {...props}
      className={cn("shrink-0", className)}
      variant="ghost"
      aria-label={hint}
      toolTip={hint}
      icon={
        <>
          <MoonIcon
            className={cn(
              "absolute hidden h-5 w-5 dark:block",
              mounted && "motion-safe:animate-theme-icon",
            )}
          />
          <SunIcon
            className={cn(
              "absolute h-5 w-5 dark:hidden",
              mounted && "motion-safe:animate-theme-icon",
            )}
          />
        </>
      }
      onClick={handleClick}
    />
  );
}
