"use client";

import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from "react";
import { ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "@/lib/utils";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";
import { Hint } from "./hint";

type ToggleOutlineItemProps = ComponentPropsWithoutRef<
  typeof ToggleGroupItem
> & {
  toolTip?: ReactNode;
};

export const ToggleOutlineItem = forwardRef<
  ElementRef<typeof ToggleGroupItem>,
  ToggleOutlineItemProps
>(({ className, children, toolTip, ...props }, ref) => {
  const playSound = useSoundEffect("click");

  return (
    <Hint value={toolTip} sideOffset={10} side="top">
      <ToggleGroupItem
        {...props}
        ref={ref}
        className={cn(
          "group relative h-8 w-8 overflow-hidden rounded-full p-0 outline outline-2 outline-offset-4 outline-accent aria-checked:outline-primary",
          className,
        )}
        onClick={() => playSound()}
      >
        {children}
      </ToggleGroupItem>
    </Hint>
  );
});

ToggleOutlineItem.displayName = ToggleGroupItem.displayName;
