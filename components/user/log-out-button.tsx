"use client";

import { signOut } from "@/lib/auth/sign-out";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton } from "../common/icon-button";
import { PowerOffIcon } from "../icons/power-off-icon";

export function LogOutButton({ className }: PropsWithClassName) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    setPending(true);
    try {
      const result = await signOut();
      router.refresh();
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
