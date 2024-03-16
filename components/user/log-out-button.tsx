"use client";

import { signOut } from "@/lib/auth/sign-out";
import { IconButton } from "../common/icon-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PowerOffIcon } from "../icons/power-off-icon";
import { useState } from "react";

export function LogOutButton({ className }: PropsWithClassName) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    setPending(true);
    try {
      const result = await signOut();
      if (result?.error) {
        toast.error("There was an error logging out.");
      } else {
        toast.success("You have been successfully logged out.");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <IconButton
      className={cn(className)}
      variant="outline"
      pending={pending}
      reverse
      onClick={handleLogOut}
      icon={<PowerOffIcon />}
    >
      Log out
    </IconButton>
  );
}
