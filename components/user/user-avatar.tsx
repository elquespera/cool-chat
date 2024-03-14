"use client";

import { authProvidersInfo } from "@/constants/auth-providers-info";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useState } from "react";
import { PersonIcon } from "@radix-ui/react-icons";

type UserAvatarProps = {
  avatarUrl: string | null;
  providerId: string | null;
} & ComponentProps<"div">;

export function UserAvatar({
  avatarUrl,
  providerId,
  className,
  ...props
}: UserAvatarProps) {
  const [src, setSrc] = useState(avatarUrl);

  const Icon =
    authProvidersInfo.find(({ id }) => id === providerId)?.icon ?? PersonIcon;

  useEffect(() => setSrc(avatarUrl), [avatarUrl]);

  return (
    <div
      className={cn(
        "relative flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          alt="Avatar"
          src={src}
          className="absolute inset-0 object-cover w-full h-full"
          onError={() => setSrc(null)}
        />
      ) : (
        <Icon className="h-[75%] w-[75%] text-muted-foreground" />
      )}
    </div>
  );
}
