"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import Markdown from "markdown-to-jsx";
import { ElementRef, forwardRef } from "react";
import { useAuth } from "../providers/auth/auth-context";
import { useMessages } from "../providers/message/message-context";
import { UserAvatar } from "../user/user-avatar";
import { MessageEditForm } from "./message-edit-form";
import { MessageMenu } from "./message-menu";
import { MessageStatus } from "./message-status";
import { MessageTimestamp } from "./message-timestamp";

type MessageItemProps = {
  message: MessageWithAuthor;
  series: boolean;
  streaming?: boolean;
};

export const MessageItem = forwardRef<ElementRef<"li">, MessageItemProps>(
  ({ message, series, streaming }, ref) => {
    const { editingId } = useMessages();
    const { id, content, author, authorId, status, createdAt, updatedAt } =
      message;
    const { user } = useAuth();
    const ownMessage = user?.id === authorId;

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
          role={author.role}
        />
        <div
          className={cn(
            "group relative flex flex-wrap gap-x-6 overflow-hidden rounded-lg bg-background px-3 py-1.5",
            id === editingId && "grow",
            ownMessage
              ? "bg-message-own text-message-own-foreground"
              : "bg-message text-message-foreground",
            status === "deleted"
              ? "opacity-50"
              : "before:absolute before:inset-0 before:z-[-1] before:bg-background",
          )}
        >
          {status === "deleted" ? (
            <p className="select-none italic">(deleted)</p>
          ) : id === editingId ? (
            <MessageEditForm message={message} />
          ) : (
            <>
              <div className="prose:max-w-0 prose prose-zinc dark:prose-invert">
                {streaming && !content && (
                  <span className="italic text-muted-foreground">{`waiting for response...`}</span>
                )}
                <Markdown>{`${content}${streaming ? " •" : ""}`}</Markdown>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <MessageTimestamp
                  createdAt={createdAt}
                  updatedAt={updatedAt}
                  className={cn(
                    ownMessage
                      ? "text-message-own-accent"
                      : "text-message-accent",
                  )}
                />
                {ownMessage && <MessageStatus status={status} />}
              </div>
              <MessageMenu message={message} ownMessage={ownMessage} />
            </>
          )}
        </div>
        <div className="w-8" />
      </li>
    );
  },
);
MessageItem.displayName = "MessageItem";
