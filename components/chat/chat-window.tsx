"use client";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { IconButton } from "../common/icon-button";
import { Spinner } from "../common/spinner";
import { MessageItem } from "../message/message-item";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";

const scrollButtonMargin = 250;
const scrollButtonTimeout = 3000;

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
  const { isAssistant, isStreaming, streamedMessage } = useAssistant();

  const listRef = useRef<HTMLUListElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isIntersecting, ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.5,
  });

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);

  const updateScrollButtonVisible = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    setScrollButtonVisible(
      scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.offsetHeight >
        scrollButtonMargin,
    );
  };

  const scrollToBottom = (behavior: ScrollBehavior) => {
    listRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  useEffect(() => {
    if (!messages) return;
    updateScrollButtonVisible();

    if (scrollBehavior) {
      scrollToBottom(scrollBehavior);
      setTimeout(() => setScrollBehavior(undefined), 10);
    }

    const scrollArea = scrollAreaRef.current;
    if (scrollHeight && scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight - scrollHeight });
      setTimeout(() => setScrollHeight(0));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (
      !isIntersecting ||
      isValidating ||
      isLoadingMore ||
      isReachingEnd ||
      scrollHeight ||
      scrollBehavior
    )
      return;

    setScrollHeight(scrollAreaRef.current?.scrollHeight ?? 0);
    fetchNextPage();
  }, [
    isIntersecting,
    isLoadingMore,
    isValidating,
    isReachingEnd,
    scrollHeight,
    scrollBehavior,
    fetchNextPage,
  ]);

  useEffect(() => {
    const timer = setTimeout(
      () => setScrollButtonVisible(false),
      scrollButtonTimeout,
    );

    return () => clearTimeout(timer);
  }, [scrollButtonVisible]);

  return (
    <div className="relative flex grow flex-col justify-center bg-muted">
      {interlocutor ? (
        messages?.length ? (
          <ScrollArea
            ref={scrollAreaRef}
            className="inset-0"
            style={{ position: "absolute" }}
            onScrollCapture={() => updateScrollButtonVisible()}
          >
            <div className="absolute bottom-1 left-1 z-10 rounded-full bg-background/80 p-2 text-foreground opacity-75">
              {messages.length}
            </div>
            <ul
              ref={listRef}
              className="mx-auto flex max-w-[48rem] flex-col-reverse p-4 pt-28"
            >
              {isAssistant &&
                isStreaming &&
                streamedMessage &&
                streamedMessage.id !== messages[0]?.id && (
                  <MessageItem
                    key={streamedMessage.id}
                    message={streamedMessage}
                    series={streamedMessage.authorId === messages[0]?.authorId}
                    streaming
                  />
                )}

              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  series={message.authorId === messages[index - 1]?.authorId}
                />
              ))}

              <li ref={loadMoreRef} />
            </ul>

            <IconButton
              className={cn(
                "absolute bottom-8 left-[50%] h-10 w-10 translate-x-[-50%] opacity-70 transition-opacity",
                !scrollButtonVisible && "sclae-0 opacity-0",
              )}
              variant="outline"
              icon={<ArrowDownIcon className="h-4 w-4" />}
              onClick={() => scrollToBottom("smooth")}
            />
          </ScrollArea>
        ) : (
          <p className="p-4 text-center text-sm font-medium text-muted-foreground">
            Type something and press &apos;Enter&apos; to send your first
            message.
            <br /> Use &apos;Shift+Enter&apos; for a new line.
          </p>
        )
      ) : (
        <p className="p-4 text-center text-sm font-medium text-muted-foreground">
          Select a contact to start or continue a conversation.
          <br />
          Use search input to find new users.
        </p>
      )}
      {(isValidating || isLoadingMore) && (
        <Spinner className="absolute top-24 w-6 self-center" />
      )}
    </div>
  );
}
