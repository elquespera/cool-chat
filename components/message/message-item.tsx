"use client";
import {
  MessageStatus as MessageStatusType,
  MessageWithAuthor,
} from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import Markdown from "markdown-to-jsx";
import { useAuth } from "../providers/auth/auth-context";
import { UserAvatar } from "../user/user-avatar";
import { MessageDeleteButton } from "./message-delete-button";
import { MessageTimestamp } from "./message-timestamp";
import { ElementRef, forwardRef } from "react";

type MessageItemProps = { message: MessageWithAuthor; series: boolean };

export const MessageItem = forwardRef<ElementRef<"li">, MessageItemProps>(
  (
    {
      message: { content, author, status, id, chatId, createdAt, updatedAt },
      series,
    },
    ref,
  ) => {
    const { user } = useAuth();
    const ownMessage = user?.id === author.id;

    return (
      <li
        ref={ref}
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
              : "border-primary/30 bg-message text-message-foreground",
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
                <div className="flex items-center gap-2">
                  <MessageTimestamp
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                  />
                  {ownMessage && <MessageStatus status={status} />}
                </div>
              </div>
            </>
          )}
        </div>
      </li>
    );
  },
);
MessageItem.displayName = "MessageItem";

type MessageStatusProps = {
  status: MessageStatusType | null;
};

function MessageStatus({ status }: MessageStatusProps) {
  return (
    <div className="relative h-4 w-5">
      <CheckIcon
        className={cn(
          "absolute text-muted-foreground opacity-50",
          status === "read" && "text-primary opacity-100",
        )}
      />
      {(status === "delivered" || status === "read") && (
        <CheckIcon
          className={cn(
            "absolute translate-x-1 text-muted-foreground opacity-50",
            status === "read" && "text-primary opacity-100",
          )}
        />
      )}
    </div>
  );
}
