"use client";

import { signOut } from "@/lib/auth/sign-out";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton } from "../common/icon-button";
import { PowerOffIcon } from "../icons/power-off-icon";
import { useColors } from "../providers/color/color-context";
import { defaultColor } from "@/constants";

export function LogOutButton({ className }: PropsWithClassName) {
  const { setColor } = useColors();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    setPending(true);
    try {
      await signOut();
      router.refresh();
      setColor(defaultColor);
    } finally {
      setPending(false);
    }
  };

  return (
    <IconButton
      className={cn(className)}
      variant="secondary"
      size="sm"
      pending={pending}
      reverse
      onClick={handleLogOut}
      icon={<PowerOffIcon />}
    >
      Log out
    </IconButton>
  );
}
