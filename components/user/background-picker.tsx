import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  ThemeBackground,
  themeBackgroundInfo,
} from "@/constants/theme-background";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Background } from "../background/background";
import { ToggleOutlineItem } from "../common/toggle-outline-item";

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
          <ToggleOutlineItem
            key={key}
            value={key}
            aria-label={name}
            toolTip={name}
          >
            <Background
              type={key as ThemeBackground}
              preview
              className="absolute inset-0"
            />
          </ToggleOutlineItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
