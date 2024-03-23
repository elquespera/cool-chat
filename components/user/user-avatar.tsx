"use client";

import { UserRole } from "@/db/schemas/auth";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useState } from "react";
import { AdminIcon } from "../icons/admin-icon";
import { AssistantIcon } from "../icons/assistant-icon";
import { UserIcon } from "../icons/user-icon";

type UserAvatarProps = {
  avatarUrl: string | null;
  role?: UserRole;
} & ComponentProps<"div">;

export function UserAvatar({
  avatarUrl,
  role = "user",
  className,
  ...props
}: UserAvatarProps) {
  const [src, setSrc] = useState(avatarUrl);

  useEffect(() => setSrc(avatarUrl), [avatarUrl]);

  const Icon =
    role === "admin"
      ? AdminIcon
      : role === "assistant"
        ? AssistantIcon
        : UserIcon;

  return (
    <div
      className={cn(
        "relative flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent",
        className,
      )}
      {...props}
    >
      {src ? (
        <img
          alt="Avatar"
          src={src}
          className="absolute left-[10%] top-[10%] h-[80%] w-[80%] overflow-hidden object-cover"
          onError={() => setSrc(null)}
        />
      ) : (
        <Icon className="h-[75%] w-[75%] text-muted-foreground" />
      )}
    </div>
  );
}
