"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

type ThemeSwitchProps = ComponentProps<typeof IconButton>;

export default function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

  return (
    <IconButton
      {...props}
      aria-label="Theme"
      className={cn("h-7 w-7", className)}
      variant="ghost"
      toolTip={`Theme: ${resolvedTheme}`}
      icon={
        <>
          <MoonIcon
            className={cn(
              "absolute hidden dark:block",
              loaded && "motion-safe:animate-theme-icon",
            )}
          />
          <SunIcon
            className={cn(
              "absolute h-4 w-4 dark:hidden",
              loaded && "motion-safe:animate-theme-icon",
            )}
          />
        </>
      }
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    />
  );
}
