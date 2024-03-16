import { cn } from "@/lib/utils";
import { User } from "lucia";
import { ComponentProps } from "react";
import { SocketIndicator } from "../common/socket-indicator";
import { UserAvatar } from "./user-avatar";
import { UserText } from "./user-text";
import { ContactUser } from "@/db/schemas/auth";

type UserInfoProps = {
  user: User | ContactUser;
  size?: "sm" | "md" | "lg";
  self?: boolean;
  status?: boolean;
  oneLine?: boolean;
  avatarUrl?: string;
} & ComponentProps<"div">;

export function UserInfo({
  user,
  size = "md",
  oneLine,
  self,
  status,
  avatarUrl,
  className,
  ...props
}: UserInfoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="relative">
        <UserAvatar
          avatarUrl={avatarUrl || user.avatarUrl}
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
