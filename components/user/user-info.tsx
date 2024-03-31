import { ContactUser } from "@/db/schemas/auth";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";
import { SocketIndicator } from "../common/socket-indicator";
import {
  StatusIndicator,
  StatusIndicatorStatus,
} from "../common/status-indicator";
import { UserAvatar } from "./user-avatar";
import { UserText } from "./user-text";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";

type UserInfoProps = {
  user: ContactUser;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  self?: boolean;
  chatId?: string;
  avatarUrl?: string;
  oneLine?: boolean;
  secondLine?: ReactNode;
} & ComponentProps<"div">;

export function UserInfo({
  user,
  size = "md",
  avatarUrl,
  oneLine,
  chatId,
  self,
  showStatus,
  secondLine,
  className,
  ...props
}: UserInfoProps) {
  const { typingContacts } = useChat();
  const { assistantChat, isStreaming } = useAssistant();

  const indicatorCn = cn(
    "absolute bottom-0 right-0",
    size === "sm" ? "w-2" : size === "lg" ? "w-3" : "w-2.5",
  );

  let status: StatusIndicatorStatus = user.status;

  if (user.role === "assistant") {
    if (isStreaming) {
      status = chatId === assistantChat?.id ? "streaming" : "offline";
    } else {
      status = "online";
    }
  } else if (typingContacts.includes(user.id)) {
    status = "typing";
  }

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
        {showStatus &&
          (self ? (
            <SocketIndicator className={indicatorCn} />
          ) : (
            <StatusIndicator status={status} className={indicatorCn} />
          ))}
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
