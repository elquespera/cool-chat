"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import Markdown from "markdown-to-jsx";
import { ElementRef, forwardRef } from "react";
import { useAuth } from "../providers/auth/auth-context";
import { UserAvatar } from "../user/user-avatar";
import { MessageMenu } from "./message-menu";
import { MessageStatus } from "./message-status";
import { MessageTimestamp } from "./message-timestamp";
import { useMessages } from "../providers/message/message-context";
import { MessageEditForm } from "./message-edit-form";

type MessageItemProps = { message: MessageWithAuthor; series: boolean };

export const MessageItem = forwardRef<ElementRef<"li">, MessageItemProps>(
  ({ message, series }, ref) => {
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
        />
        <div
          className={cn(
            "group relative flex max-w-[24rem] flex-wrap gap-x-6 overflow-hidden rounded-lg border bg-background px-3 py-1.5",
            id === editingId && "grow",
            ownMessage
              ? "bg-message-own text-message-own-foreground"
              : "border-primary/20 bg-message text-message-foreground",
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
              <div className="prose prose-zinc dark:prose-invert">
                <Markdown>{content}</Markdown>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <MessageTimestamp
                  createdAt={createdAt}
                  updatedAt={updatedAt}
                  className={cn(
                    ownMessage ? "text-muted-foreground" : "text-primary/70",
                  )}
                />
                {ownMessage && <MessageStatus status={status} />}
              </div>
              <MessageMenu message={message} ownMessage={ownMessage} />
            </>
          )}
        </div>
      </li>
    );
  },
);
MessageItem.displayName = "MessageItem";
