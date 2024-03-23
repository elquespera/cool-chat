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
import { UserText } from "../user/user-text";

type MessageItemProps = {
  message: MessageWithAuthor;
  type: "only" | "first" | "middle" | "last";
  streaming?: boolean;
};

const radius = "12px";

export const MessageItem = forwardRef<ElementRef<"li">, MessageItemProps>(
  ({ message, type, streaming }, ref) => {
    const { editingId } = useMessages();
    const { id, content, author, authorId, status, createdAt, updatedAt } =
      message;
    const { user } = useAuth();
    const ownMessage = user?.id === authorId;

    const isLast = type === "last" || type === "only";
    const isFirst = type === "first" || type === "only";

    return (
      <li
        ref={ref}
        className={cn(
          "flex flex-col",
          ownMessage ? "items-end" : "items-start",
          isLast ? "mb-12" : "mb-2",
        )}
      >
        {isFirst && (
          <div
            className={cn(
              "mb-1 flex select-none items-center gap-2",
              ownMessage && "flex-row-reverse",
            )}
          >
            <UserAvatar
              className={cn(
                "w-8 lg:w-10",
                ownMessage ? "bg-message-own" : "bg-message",
              )}
              avatarUrl={author.avatarUrl}
              role={author.role}
            />
            <UserText
              className="text-sm lg:text-base"
              username={author.username}
              email={author.email}
              oneLine
            />
            <MessageTimestamp
              createdAt={createdAt}
              updatedAt={updatedAt}
              className={cn(
                "mx-2 text-sm text-muted-foreground opacity-70 lg:text-base",
              )}
            />
          </div>
        )}

        <div
          className={cn(
            "group relative flex flex-wrap gap-x-6 overflow-hidden bg-background px-4 py-3",
            id === editingId && "grow",
            type !== "only" && "w-[calc(100%-1.5em)] lg:w-[calc(100%-2em)]",
            ownMessage
              ? "mr-[1.5rem] bg-message-own text-message-own-foreground lg:mr-[2rem]"
              : "ml-[1.5rem] bg-message text-message-foreground lg:ml-[2rem]",
            status === "deleted"
              ? "opacity-50"
              : "before:absolute before:inset-0 before:z-[-1] before:bg-background",
          )}
          style={{
            borderRadius:
              type === "first"
                ? ownMessage
                  ? `${radius} 0 0 0`
                  : `0 ${radius} 0 0`
                : type === "last"
                  ? `0 0 ${radius} ${radius}`
                  : type === "middle"
                    ? "0 0 0 0"
                    : ownMessage
                      ? `${radius} 0 ${radius} ${radius}`
                      : `0 ${radius} ${radius} ${radius}`,
          }}
        >
          {status === "deleted" ? (
            <p className="select-none italic">(deleted)</p>
          ) : id === editingId ? (
            <MessageEditForm message={message} />
          ) : (
            <>
              <div className="prose:max-w-0 prose prose-sm prose-zinc dark:prose-invert lg:prose-base">
                {streaming && !content && (
                  <span className="italic text-muted-foreground">{`waiting for response...`}</span>
                )}
                <Markdown>{`${content}${streaming ? " •" : ""}`}</Markdown>
              </div>
              <div className="ml-auto flex items-center gap-2">
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
