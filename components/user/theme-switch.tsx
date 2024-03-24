"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { SunIcon } from "../icons/sun-icon";
import { MoonIcon } from "../icons/moon-icon";

type ThemeSwitchProps = ComponentProps<typeof IconButton>;

export default function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

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
              loaded && "motion-safe:animate-theme-icon",
            )}
          />
          <SunIcon
            className={cn(
              "absolute h-5 w-5 dark:hidden",
              loaded && "motion-safe:animate-theme-icon",
            )}
          />
        </>
      }
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    />
  );
}
