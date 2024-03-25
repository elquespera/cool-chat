"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import Markdown from "markdown-to-jsx";
import { ElementRef, forwardRef, useEffect, useMemo, useState } from "react";
import { Timestamp } from "../common/timestamp";
import { useAuth } from "../providers/auth/auth-context";
import { useMessages } from "../providers/message/message-context";
import { UserAvatar } from "../user/user-avatar";
import { UserText } from "../user/user-text";
import { MessageEditForm } from "./message-edit-form";
import { MessageMenu } from "./message-menu";
import { MessageStatus } from "./message-status";
import { useIntersectionObserver } from "usehooks-ts";
import { useMessageStatus } from "./use-message-status";

type MessageType = "only" | "first" | "middle" | "last";
type MessageItemProps = {
  message: MessageWithAuthor;
  type: MessageType;
  streaming?: boolean;
};

export const MessageItem = forwardRef<ElementRef<"li">, MessageItemProps>(
  ({ message, type, streaming }, ref) => {
    const { editingId } = useMessages();
    const { id, content, author, authorId, status, createdAt, updatedAt } =
      message;
    const { user } = useAuth();
    const { isIntersecting, ref: readMsgRef } = useIntersectionObserver({
      threshold: 0.5,
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false);
    const setMessageStatus = useMessageStatus(message);

    const ownMessage = user?.id === authorId;
    const isLast = type === "last" || type === "only";
    const isFirst = type === "first" || type === "only";
    const isEdited = Math.abs(createdAt.getTime() - updatedAt.getTime()) > 1000;

    const borderRadius = useMemo(
      () => calculateBorderRadius(type, ownMessage),
      [type, ownMessage],
    );

    useEffect(() => {
      if (
        ownMessage ||
        streaming ||
        statusChanged ||
        !isIntersecting ||
        status !== "delivered"
      )
        return;
      setStatusChanged(true);
      setMessageStatus("read");
    }, [isIntersecting, status, ownMessage, streaming, setMessageStatus]);

    return (
      <li
        ref={readMsgRef}
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
            <span className="mx-2 text-xs tracking-tight text-muted-foreground opacity-70 lg:text-sm">
              <Timestamp time={createdAt} style={isEdited ? "short" : "long"} />
              {isEdited && (
                <>
                  {", edited "}
                  <Timestamp time={updatedAt} />
                </>
              )}
            </span>
          </div>
        )}

        <div
          className={cn(
            "group relative flex flex-wrap gap-x-6 overflow-hidden bg-background px-4 py-3",
            (type !== "only" || id === editingId) &&
              "w-[calc(100%-1.5em)] lg:w-[calc(100%-2em)]",
            ownMessage
              ? "mr-[1.5rem] bg-message-own text-message-own-foreground lg:mr-[2rem]"
              : "ml-[1.5rem] bg-message text-message-foreground lg:ml-[2rem]",
            status === "deleted" && "opacity-50",
          )}
          style={{ borderRadius }}
          onContextMenu={(event) => {
            event.preventDefault();
            setMenuOpen(true);
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
              <MessageMenu
                open={menuOpen}
                setOpen={setMenuOpen}
                message={message}
                ownMessage={ownMessage}
              />
            </>
          )}
        </div>
      </li>
    );
  },
);
MessageItem.displayName = "MessageItem";

const radius = "16px";
const smallRadius = "2px";

const calculateBorderRadius = (type: MessageType, ownMessage: boolean) =>
  type === "first"
    ? ownMessage
      ? `${radius} ${smallRadius} ${smallRadius} ${smallRadius}`
      : `${smallRadius} ${radius} ${smallRadius} ${smallRadius}`
    : type === "last"
      ? `${smallRadius} ${smallRadius} ${radius} ${radius}`
      : type === "middle"
        ? `${smallRadius} ${smallRadius} ${smallRadius} ${smallRadius}`
        : ownMessage
          ? `${radius} ${smallRadius} ${radius} ${radius}`
          : `${smallRadius} ${radius} ${radius} ${radius}`;
