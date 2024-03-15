"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/auth/auth-context";
import { UserAvatar } from "../user/user-avatar";

type MessageItemProps = { message: MessageWithAuthor; series: boolean };

export function MessageItem({
  message: { content, author, createdAt },
  series,
}: MessageItemProps) {
  const { user } = useAuth();
  const ownMessage = user?.id === author.id;

  return (
    <li
      className={cn(
        "flex items-end gap-2",
        ownMessage && "flex-row-reverse",
        series ? "mb-2" : "mb-8",
      )}
    >
      <UserAvatar
        className={cn(series && "opacity-0")}
        avatarUrl={author.avatarUrl}
      />
      <div className="flex max-w-[24rem] grow flex-col rounded-md border bg-background p-4">
        <p>{content}</p>
        <p className="self-end text-sm text-muted-foreground">
          {createdAt.toLocaleTimeString()}
        </p>
      </div>
    </li>
  );
}
