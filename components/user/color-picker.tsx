import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ThemeColor, themeColorInfo } from "@/constants";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Hint } from "../common/hint";
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
        "relative flex items-center justify-between gap-4 p-4",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground">Theme Color </p>
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
            <ToggleGroupItem
              value={key}
              aria-label={name}
              className="group h-5 w-5 overflow-auto rounded-full p-0 outline-2 outline-offset-4 aria-checked:outline"
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
            </ToggleGroupItem>
          </Hint>
        ))}
      </ToggleGroup>
    </div>
  );
}
