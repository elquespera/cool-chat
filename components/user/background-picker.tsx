import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ThemeBackground,
  themeBackgroundInfo,
} from "@/constants/theme-background";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Hint } from "../common/hint";
import { Background } from "../background/background";

type BackgroundPickerProps = {
  background: ThemeBackground;
  setBackground: (background: ThemeBackground) => void;
} & ComponentProps<"div">;

export function BackgroundPicker({
  background,
  setBackground,
  className,
  ...props
}: BackgroundPickerProps) {
  const playSound = useSoundEffect("click");

  return (
    <div
      className={cn(
        "relative flex items-start justify-between gap-4 p-4",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground">Background</p>
      <ToggleGroup
        type="single"
        className="flex flex-wrap justify-start gap-4"
        value={background}
        onValueChange={setBackground}
      >
        {Object.entries(themeBackgroundInfo).map(([key, { name }]) => (
          <Hint key={key} value={name} sideOffset={10} side="top">
            <ToggleGroupItem
              value={key}
              aria-label={name}
              className="group relative h-8 w-8 overflow-hidden rounded-full p-0 outline outline-2 outline-offset-4 outline-accent aria-checked:outline-primary"
              onClick={() => playSound()}
            >
              <Background
                key={key}
                preview
                type={key as ThemeBackground}
                className="absolute inset-0"
              />
            </ToggleGroupItem>
          </Hint>
        ))}
      </ToggleGroup>
    </div>
  );
}
