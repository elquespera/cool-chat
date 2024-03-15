import type { ContactUser } from "@/db/schemas/auth";
import { UserAvatar } from "./user-avatar";
import { SocketIndicator } from "../common/socket-indicator";
import { UserText } from "./user-text";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type UserInfoProps = {
  user: ContactUser;
  size?: "sm" | "md" | "lg";
  self?: boolean;
  status?: boolean;
  oneLine?: boolean;
} & ComponentProps<"div">;

export function UserInfo({
  user,
  size = "md",
  oneLine,
  self,
  status,
  className,
  ...props
}: UserInfoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="relative">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          className={cn(
            size === "sm" ? "w-8" : size === "lg" ? "w-12" : "w-10",
          )}
        />
        {status && self && (
          <SocketIndicator
            className={cn(
              "absolute right-0 top-0",
              size === "sm" ? "w-2" : size === "lg" ? "w-3" : "w-2.5",
            )}
          />
        )}
      </div>
      <UserText
        email={user.email}
        username={user.username}
        oneLine={oneLine}
        className={cn(
          size === "sm" ? "text-sm" : size === "md" ? "text-sm" : "text-base",
        )}
      />
    </div>
  );
}