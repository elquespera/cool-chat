"use client";

import { cn } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";
import { ComponentProps, useEffect, useState } from "react";

type UserAvatarProps = {
  avatarUrl: string | null;
} & ComponentProps<"div">;

export function UserAvatar({
  avatarUrl,
  className,
  ...props
}: UserAvatarProps) {
  const [src, setSrc] = useState(avatarUrl);

  useEffect(() => setSrc(avatarUrl), [avatarUrl]);

  return (
    <div
      className={cn(
        "relative flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {src ? (
        <img
          alt="Avatar"
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setSrc(null)}
        />
      ) : (
        <PersonIcon className="h-[75%] w-[75%] text-muted-foreground" />
      )}
    </div>
  );
}
