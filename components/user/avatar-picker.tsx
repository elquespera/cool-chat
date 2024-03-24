import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import { IconButton } from "../common/icon-button";
import { UserAvatar } from "./user-avatar";
import { generateAvatarURLs } from "@/lib/generate-avatar-url";
import { RefreshIcon } from "../icons/refresh-icon";

type AvatarPickerProps = {
  count?: number;
  url: string;
  onUrlChange: (url: string) => void;
} & ComponentProps<"div">;

export function AvatarPicker({
  url,
  onUrlChange,
  count = 8,
  className,
  ...props
}: AvatarPickerProps) {
  const [avatars, setAvatars] = useState(generateAvatarURLs(count));

  const handleRegenerateClick = () => {
    setAvatars(generateAvatarURLs(count));
    onUrlChange("");
  };

  return (
    <div className={cn("relative rounded-md p-4", className)} {...props}>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Avatar</p>
        <IconButton
          icon={<RefreshIcon />}
          toolTip="Regenerate"
          aria-label="Regenerate"
          toolTipSide="left"
          className="h-7 w-7"
          variant="ghost"
          onClick={handleRegenerateClick}
        />
      </div>
      <ToggleGroup
        type="single"
        className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] grid-rows-[4rem] justify-center justify-items-center gap-2"
        value={url}
        onValueChange={onUrlChange}
      >
        {avatars.map((url) => (
          <ToggleGroupItem key={url} value={url} className="h-14 w-14">
            <UserAvatar avatarUrl={url} className="w-10" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
