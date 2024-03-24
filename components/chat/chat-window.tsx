"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { IconButton } from "../common/icon-button";
import { Spinner } from "../common/spinner";
import { MessageItem } from "../message/message-item";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowUpIcon } from "../icons/arrow-up-icon";

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
    if (isAssistant) scrollToBottom("instant");
  }, [streamedMessage, isAssistant]);

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
    <div className="relative flex grow flex-col justify-center">
      {interlocutor ? (
        messages?.length ? (
          <ScrollArea
            ref={scrollAreaRef}
            className="inset-0"
            style={{ position: "absolute" }}
            onScrollCapture={() => updateScrollButtonVisible()}
          >
            <ul
              ref={listRef}
              className="mx-auto flex max-w-[48rem] flex-col-reverse px-4 pb-16 pt-28 md:px-8"
            >
              {isAssistant &&
                isStreaming &&
                streamedMessage &&
                streamedMessage.id !== messages[0]?.id && (
                  <MessageItem
                    key={streamedMessage.id}
                    message={streamedMessage}
                    type={
                      streamedMessage.authorId === messages[0]?.authorId
                        ? "first"
                        : "only"
                    }
                    streaming
                  />
                )}

              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  type={
                    message.authorId === messages[index - 1]?.authorId &&
                    message.authorId === messages[index + 1]?.authorId
                      ? "middle"
                      : message.authorId === messages[index - 1]?.authorId
                        ? "first"
                        : message.authorId === messages[index + 1]?.authorId
                          ? "last"
                          : "only"
                  }
                />
              ))}

              <li ref={loadMoreRef} />
            </ul>

            <IconButton
              className={cn(
                "absolute bottom-4 right-8 h-12 w-12 opacity-70 transition-opacity",
                !scrollButtonVisible && "scale-0 opacity-0",
              )}
              variant="outline"
              icon={<ArrowUpIcon className="h-5 w-5" />}
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
