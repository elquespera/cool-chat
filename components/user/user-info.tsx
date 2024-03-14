import type { ContactUser } from "@/db/schemas/auth";
import { UserAvatar } from "./user-avatar";
import { SocketIndicator } from "../common/socket-indicator";
import { UserText } from "./user-text";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type UserInfoProps = {
  user: ContactUser;
  avatarSize?: "small" | "normal";
  self?: boolean;
  status?: boolean;
  oneLine?: boolean;
} & ComponentProps<"div">;

export function UserInfo({
  user,
  avatarSize = "normal",
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
          className={cn(avatarSize === "small" ? "w-8" : "w-10")}
        />
        {status && self && (
          <SocketIndicator
            className={cn(
              "absolute right-0 top-0",
              avatarSize === "small" ? "w-2" : "w-2.5",
            )}
          />
        )}
      </div>
      <UserText email={user.email} username={user.username} oneLine={oneLine} />
    </div>
  );
}
