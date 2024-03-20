"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useChat } from "../chat/chat-context";
import { ChatScroll, MessageContext } from "./message-context";

import useSWRInfinite from "swr/infinite";
import useSWR from "swr";

const getKey = (index: number, previousData: MessageWithAuthor[]) => {
  if (previousData && !previousData.length) return null;
  return `/users?page=${index}&limit=10`;
};

export function MessageProvider({ children }: PropsWithChildren) {
  const { chat } = useChat();
  const [chatScroll, setChatScroll] = useState<ChatScroll>();

  const {
    data: messages,
    mutate,
    isLoading,
  } = useSWR(
    chat ? { chatId: chat.id, pageIndex: 0 } : null,
    ({ chatId, pageIndex }) => getMessagesByChatId(chatId),
  );

  const refetch = useMemo(
    () => async (scroll?: ChatScroll) => {
      setChatScroll(scroll);
      await mutate();
    },
    [mutate],
  );

  useCustomEvent(
    "messageupdate",
    async ({ chatId, status }) => {
      if (chat?.id !== chatId) return;

      refetch(
        status === "created" || status === "delivered" ? "smooth" : "none",
      );
    },
    [refetch],
  );

  return (
    <MessageContext.Provider
      value={{ messages, isLoading, refetch, chatScroll }}
    >
      {children}
    </MessageContext.Provider>
  );
}
