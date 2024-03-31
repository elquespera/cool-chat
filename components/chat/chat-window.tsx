"use client";
import { MessageSelect } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { IconButton } from "../common/icon-button";
import { Spinner } from "../common/spinner";
import { ArrowUpIcon } from "../icons/arrow-up-icon";
import { MessageItem } from "../message/message-item";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";
import { ChatError } from "./chat-error";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const scrollButtonMargin = 250;
const scrollButtonTimeout = 3000;

export function ChatWindow() {
  const { chat } = useChat();
  const {
    messages,
    fetchNextPage,
    scrollBehavior,
    setScrollBehavior,
    isReachingEnd,
    isLoading,
    isValidating,
  } = useMessages();
  const {
    isAssistant,
    isStreaming,
    streamedMessage,
    error: assistantError,
    assistantChat,
  } = useAssistant();

  const listRef = useRef<HTMLUListElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isIntersecting, ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.5,
  });

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);

  const streamingMsgVisible =
    isStreaming &&
    chat?.id === streamedMessage?.chatId &&
    streamedMessage?.id !== messages?.[0].id;

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
      setTimeout(() => setScrollBehavior(undefined), 100);
    }

    const scrollArea = scrollAreaRef.current;
    if (scrollHeight && scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight - scrollHeight });
      setTimeout(() => setScrollHeight(0), 100);
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
      isReachingEnd ||
      scrollHeight ||
      scrollBehavior
    )
      return;

    setScrollHeight(scrollAreaRef.current?.scrollHeight ?? 0);
    fetchNextPage();
  }, [
    isIntersecting,
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

  return messages?.length ? (
    <ScrollArea
      ref={scrollAreaRef}
      className="inset-0"
      style={{ position: "absolute" }}
      onScrollCapture={() => updateScrollButtonVisible()}
    >
      <PhotoProvider>
        <ul
          ref={listRef}
          className="mx-auto flex max-w-[48rem] flex-col-reverse px-4 pb-16 pt-28 @container md:px-8"
        >
          {chat?.id === assistantChat?.id && assistantError && (
            <ChatError>{assistantError}</ChatError>
          )}
          {streamingMsgVisible && (
            <MessageItem
              key={streamedMessage.id}
              message={streamedMessage}
              type={
                streamedMessage.authorId === messages[0]?.authorId
                  ? "first"
                  : "only"
              }
              streaming
              autoScroll
            />
          )}

          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              type={getMessageType(
                message,
                messages[index - 1],
                messages[index + 1],
              )}
              autoScroll={!streamingMsgVisible && index === 0}
            />
          ))}

          <li ref={loadMoreRef} />
        </ul>
      </PhotoProvider>

      <IconButton
        className={cn(
          "absolute bottom-24 right-12 h-10 w-10 opacity-70 transition-opacity",
          !scrollButtonVisible && "scale-0 opacity-0",
        )}
        variant="outline"
        icon={<ArrowUpIcon className="h-5 w-5 rotate-180" />}
        onClick={() => scrollToBottom("smooth")}
      />
      {isLoading && (
        <Spinner className="-translate-[50%] absolute left-[50%] top-24 w-6" />
      )}
    </ScrollArea>
  ) : null;
}

const getMessageType = <T extends MessageSelect>(
  message: T,
  previous?: T,
  next?: T,
) =>
  message.authorId === previous?.authorId && message.authorId === next?.authorId
    ? "middle"
    : message.authorId === previous?.authorId
      ? "first"
      : message.authorId === next?.authorId
        ? "last"
        : "only";
