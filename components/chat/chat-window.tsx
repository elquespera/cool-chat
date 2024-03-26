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
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { Background } from "../background/background";
import { useSettings } from "../providers/settings/settings-context";

const scrollButtonMargin = 250;
const scrollButtonTimeout = 3000;

export function ChatWindow() {
  const { interlocutor, chat } = useChat();
  const {
    messages,
    fetchNextPage,
    refetchMessages,
    scrollBehavior,
    setScrollBehavior,
    isReachingEnd,
    isLoading,
    isValidating,
  } = useMessages();
  const { isAssistant, isStreaming, streamedMessage } = useAssistant();
  const { background } = useSettings();

  const listRef = useRef<HTMLUListElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isIntersecting, ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.5,
  });

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);

  const streamingMsgVisible =
    isAssistant && isStreaming && chat?.id === streamedMessage?.chatId;
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

  useCustomEvent("assistantresponse", () => refetchMessages("smooth"), [
    [refetchMessages],
  ]);

  return interlocutor && messages?.length ? (
    <Background asChild type={background}>
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
              autoScroll={!streamingMsgVisible && index === 0}
            />
          ))}

          <li ref={loadMoreRef} />
        </ul>

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
    </Background>
  ) : null;
}
