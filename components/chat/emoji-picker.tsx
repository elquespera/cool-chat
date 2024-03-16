import { cn } from "@/lib/utils";
import { ComponentProps, Suspense, lazy, useState } from "react";
import { IconButton } from "../common/icon-button";
import { SmileIcon } from "../icons/smile-icon";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Picker = lazy(() => import("./emoji-picker-internal"));

type EmojiPickerProps = {
  onEmojiChange: (value: string) => void;
} & ComponentProps<typeof IconButton>;

export function EmojiPicker({
  onEmojiChange,
  className,
  ...props
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          {...props}
          type="button"
          variant="ghost"
          toolTip="Add emoji"
          toolTipSide="right"
          className={cn("h-7 w-7", className)}
          icon={<SmileIcon className="h-4 w-4" />}
        />
      </PopoverTrigger>
      <PopoverContent
        className="min-w-auto border-none bg-transparent shadow-none"
        align="start"
        sideOffset={-10}
        alignOffset={-20}
      >
        {open && (
          <Suspense>
            <Picker
              theme="light"
              onEmojiSelect={(emoji: { native: string }) =>
                onEmojiChange(emoji.native)
              }
            />
          </Suspense>
        )}
      </PopoverContent>
    </Popover>
  );
}
