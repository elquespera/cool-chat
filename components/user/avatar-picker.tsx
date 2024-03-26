import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import { IconButton } from "../common/icon-button";
import { UserAvatar } from "./user-avatar";
import { generateAvatarURLs } from "@/lib/generate-avatar-url";
import { RefreshIcon } from "../icons/refresh-icon";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";

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
  const playClick = useSoundEffect("click");
  const playRegenerate = useSoundEffect("refresh");

  const handleRegenerateClick = () => {
    playRegenerate;
    setAvatars(generateAvatarURLs(count));
    onUrlChange("");
  };

  return (
    <div
      className={cn(
        "relative flex items-start justify-between gap-4 p-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
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
        className="flex flex-wrap justify-end gap-6"
        value={url}
        onValueChange={onUrlChange}
        onClick={() => playClick()}
      >
        {avatars.map((url) => (
          <ToggleGroupItem
            key={url}
            value={url}
            className="h-8 w-8 rounded-full outline outline-2 outline-offset-4 outline-accent aria-checked:outline-primary"
          >
            <UserAvatar avatarUrl={url} className="w-8" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
