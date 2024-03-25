import { ContactUser } from "@/db/schemas/auth";
import { cn } from "@/lib/utils";
import { User } from "lucia";
import { ComponentProps, ReactNode } from "react";
import { SocketIndicator } from "../common/socket-indicator";
import { StatusIndicator } from "../common/status-indicator";
import { UserAvatar } from "./user-avatar";
import { UserText } from "./user-text";

type UserInfoProps = {
  user: User | ContactUser;
  size?: "sm" | "md" | "lg";
  self?: boolean;
  status?: UserStatus | true;
  avatarUrl?: string;
  oneLine?: boolean;
  secondLine?: ReactNode;
} & ComponentProps<"div">;

export function UserInfo({
  user,
  size = "md",
  oneLine,
  self,
  avatarUrl,
  status,
  secondLine,
  className,
  ...props
}: UserInfoProps) {
  const indicatorCn = cn(
    "absolute bottom-0 right-0",
    size === "sm" ? "w-2" : size === "lg" ? "w-3" : "w-2.5",
  );

  return (
    <div
      className={cn("flex items-center gap-2 overflow-hidden", className)}
      {...props}
    >
      <div className="relative">
        <UserAvatar
          avatarUrl={avatarUrl || user.avatarUrl}
          role={user?.role}
          className={cn(
            size === "sm" ? "w-8" : size === "lg" ? "w-12" : "w-10",
          )}
        />
        {status === true ? (
          self ? (
            <SocketIndicator className={indicatorCn} />
          ) : user.role === "assistant" ? (
            <StatusIndicator status="online" className={indicatorCn} />
          ) : null
        ) : (
          <StatusIndicator status={status} className={indicatorCn} />
        )}
      </div>
      <UserText
        email={user.email}
        username={user.username}
        oneLine={oneLine}
        secondLine={secondLine}
        className={cn(
          size === "sm" ? "text-sm" : size === "md" ? "text-sm" : "text-base",
        )}
      />
    </div>
  );
}
