"use client";

import { updateSettings } from "@/db/actions/settings";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { IconButton } from "../common/icon-button";
import { SoundOffIcon } from "../icons/sound-off-icon";
import { SoundOnIcon } from "../icons/sound-on-icon";
import { useSettings } from "../providers/settings/settings-context";

type SoundSwitchProps = ComponentProps<typeof IconButton>;

export default function SoundSwitch({ className, ...props }: SoundSwitchProps) {
  const { sound, setSound } = useSettings();

  const handleClick = async () => {
    const result = await updateSettings({ sound: !sound });
    if (result.ok) setSound(result.data.sound);
  };

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
      onClick={handleClick}
    />
  );
}
