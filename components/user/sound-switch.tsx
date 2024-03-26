"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { SunIcon } from "../icons/sun-icon";
import { MoonIcon } from "../icons/moon-icon";
import { SoundOffIcon } from "../icons/sound-off-icon";
import { SoundOnIcon } from "../icons/sound-on-icon";

type SoundSwitchProps = ComponentProps<typeof IconButton>;

export default function SoundSwitch({ className, ...props }: SoundSwitchProps) {
  const [sound, setSound] = useState(false);

  const hint = sound ? "Sound on" : "Sound off";

  return (
    <IconButton
      {...props}
      className={cn("shrink-0", className)}
      variant="ghost"
      aria-label={hint}
      toolTip={hint}
      icon={
        <>
          <SoundOffIcon className={cn("absolute h-5 w-5", sound && "hidden")} />
          <SoundOnIcon className={cn("absolute h-5 w-5", !sound && "hidden")} />
        </>
      }
      onClick={() => setSound((current) => !current)}
    />
  );
}
