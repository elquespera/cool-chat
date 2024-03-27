"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useChat } from "../chat/chat-context";
import { MessageContext } from "./message-context";

const messagesPerPage = 10;

export function MessageProvider({ children }: PropsWithChildren) {
  const { chat } = useChat();
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>();
  const [editingId, setEditingId] = useState<string>();

  const { data, mutate, isLoading, isValidating, size, setSize } =
    useSWRInfinite(
      (pageIndex: number, previousData: MessageWithAuthor[]) => {
        if (!chat || (previousData && !previousData.length)) return null;
        return { chatId: chat.id, pageIndex };
      },
      async ({ chatId, pageIndex }) => {
        const result = await getMessagesByChatId(
          chatId,
          pageIndex,
          messagesPerPage,
        );
        return result.ok ? result.data : [];
      },
    );

  const messages = useMemo(() => data?.flat(), [data]);

  const refetchMessages = useCallback(
    async (scrollBehavior?: ScrollBehavior) => {
      setScrollBehavior(scrollBehavior);
      await mutate();
    },
    [mutate],
  );

  useCustomEvent(
    "messageupdate",
    async ({ chatId, status }) => {
      if (chat?.id !== chatId) return;

      refetchMessages(
        status === "created" || status === "delivered" ? "smooth" : undefined,
      );
    },
    [refetchMessages],
  );

  const value = useMemo(
    () => ({
      messages,
      isValidating,
      isReachingEnd:
        data?.[0]?.length === 0 ||
        (!!data && data[data.length - 1]?.length < messagesPerPage),
      isLoading:
        isLoading || (size > 0 && !!data && data[size - 1] === undefined),
      editingId,
      scrollBehavior,
      setScrollBehavior,
      refetchMessages,
      fetchNextPage: () => setSize(size + 1),
      setEditingId,
    }),
    [
      data,
      messages,
      size,
      isValidating,
      isLoading,
      editingId,
      scrollBehavior,
      setSize,
      refetchMessages,
    ],
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
