"use client";

import { defaultSettings } from "@/constants";
import { signOut } from "@/lib/auth/sign-out";
import { usePendingState } from "@/lib/hooks/use-pending-state";
import { cn } from "@/lib/utils";
import { IconButton } from "../common/icon-button";
import { PowerOffIcon } from "../icons/power-off-icon";
import { useSettings } from "../providers/settings/settings-context";

export function LogOutButton({ className }: PropsWithClassName) {
  const { setColor } = useSettings();

  const { trigger: handleLogOut, isPending } = usePendingState(async () => {
    await signOut();
    setColor(defaultSettings.color);
  });

  return (
    <IconButton
      type="button"
      className={cn(className)}
      variant="secondary"
      size="sm"
      pending={isPending}
      reverse
      onClick={handleLogOut}
      icon={<PowerOffIcon />}
    >
      Log out
    </IconButton>
  );
}
