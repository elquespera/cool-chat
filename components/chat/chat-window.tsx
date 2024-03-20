"use client";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Spinner } from "../common/spinner";
import { MessageItem } from "../message/message-item";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";

export function ChatWindow() {
  const { interlocutor } = useChat();
  const {
    messages,
    fetchNextPage,
    scrollBehavior,
    setScrollBehavior,
    isReachingEnd,
    isLoadingMore,
    isValidating,
  } = useMessages();
  const listRef = useRef<HTMLUListElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isIntersecting, ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.5,
  });

  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (!messages) return;

    if (scrollBehavior) {
      listRef.current?.scrollIntoView({
        behavior: scrollBehavior,
        block: "end",
      });
      setScrollBehavior(undefined);
    }

    const scrollArea = scrollAreaRef.current;
    if (scrollHeight && scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight - scrollHeight });
      setTimeout(() => setScrollHeight(0));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!isIntersecting || isLoadingMore || isReachingEnd || scrollHeight)
      return;

    setScrollHeight(scrollAreaRef.current?.scrollHeight ?? 0);
    fetchNextPage();
  }, [
    isIntersecting,
    isLoadingMore,
    isReachingEnd,
    scrollHeight,
    fetchNextPage,
  ]);

  return (
    <div className="relative flex grow flex-col justify-center bg-muted">
      {interlocutor ? (
        isValidating ? (
          <Spinner className="w-8 self-center" />
        ) : messages?.length ? (
          <ScrollArea
            ref={scrollAreaRef}
            className="inset-0"
            style={{ position: "absolute" }}
          >
            <div className="absolute bottom-1 left-1 z-10 rounded-full bg-background/80 p-2 text-foreground opacity-75">
              {messages.length}
            </div>
            <ul
              ref={listRef}
              className="mx-auto flex max-w-[48rem] flex-col-reverse p-4 pt-24"
            >
              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  series={message.authorId === messages[index - 1]?.authorId}
                />
              ))}

              <li
                ref={loadMoreRef}
                className={cn(
                  "flex justify-center pb-4 opacity-0 transition-opacity",
                  isLoadingMore && "opacity-100",
                )}
              >
                <Spinner />
              </li>
            </ul>
          </ScrollArea>
        ) : (
          <ChatEmpty
            message={
              <p>
                Type something and press &apos;Enter&apos; to send your first
                message.
                <br /> Use &apos;Shift+Enter&apos; for a new line.
              </p>
            }
          />
        )
      ) : (
        <ChatEmpty
          message={
            <p>
              Select a contact to start or continue a conversation.
              <br />
              Use search input to find new users.
            </p>
          }
        />
      )}
    </div>
  );
}

function ChatEmpty({ message }: { message: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center p-4 text-center text-sm font-medium text-muted-foreground">
      {message}
    </div>
  );
}
