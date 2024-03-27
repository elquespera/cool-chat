import { ToggleGroup } from "@/components/ui/toggle-group";
import { ThemeColor, themeColorInfo } from "@/constants/theme-color";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Hint } from "../common/hint";
import { ToggleOutlineItem } from "../common/toggle-outline-item";
import { CheckIcon } from "../icons/check-icon";

type ColorPickerProps = {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
} & ComponentProps<"div">;

export function ColorPicker({
  color,
  setColor,
  className,
  ...props
}: ColorPickerProps) {
  return (
    <div
      className={cn(
        "relative flex items-start justify-between gap-4 p-4",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground">Color</p>
      <ToggleGroup
        type="single"
        className="flex flex-wrap justify-start gap-4"
        value={color}
        onValueChange={setColor}
      >
        {Object.entries(themeColorInfo).map(([key, { color, name }]) => (
          <Hint
            key={key}
            value={name}
            sideOffset={10}
            side="top"
            style={{ background: color }}
          >
            <ToggleOutlineItem
              value={key}
              aria-label={name}
              className="h-5 w-5 outline-0 aria-checked:outline-2"
              style={{ outlineColor: color }}
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <CheckIcon
                  className={cn(
                    "hidden text-background group-aria-checked:block",
                  )}
                />
              </div>
            </ToggleOutlineItem>
          </Hint>
        ))}
      </ToggleGroup>
    </div>
  );
}
