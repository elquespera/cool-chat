"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/auth/auth-context";
import { UserAvatar } from "../user/user-avatar";
import { MessageDeleteButton } from "./message-delete-button";
import { MessageTimestamp } from "./message-timestamp";
import Markdown from "markdown-to-jsx";

type MessageItemProps = { message: MessageWithAuthor; series: boolean };

export function MessageItem({
  message: { content, author, status, id, chatId, createdAt, updatedAt },
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
      <div
        className={cn(
          "group relative flex max-w-[24rem] grow flex-col overflow-hidden rounded-md border bg-background p-4",

          ownMessage
            ? "bg-message-own text-message-own-foreground"
            : "bg-message text-message-foreground border-primary/30",
          status === "deleted"
            ? "opacity-50"
            : "before:absolute before:inset-0 before:z-[-1] before:bg-background",
        )}
      >
        {status === "deleted" ? (
          <p className="select-none italic">(deleted)</p>
        ) : (
          <>
            <div className="prose prose-zinc dark:prose-invert">
              <Markdown>{content}</Markdown>
            </div>

            <div className="mt-2 flex items-end justify-between gap-2">
              <div className="flex">
                {ownMessage && (
                  <MessageDeleteButton
                    messageId={id}
                    chatId={chatId}
                    authorId={author.id}
                  />
                )}
              </div>
              <div className="flex">
                <MessageTimestamp createdAt={createdAt} updatedAt={updatedAt} />
              </div>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
