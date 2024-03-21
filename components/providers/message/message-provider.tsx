"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useMemo, useState } from "react";
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
      ({ chatId, pageIndex }) =>
        getMessagesByChatId(chatId, pageIndex, messagesPerPage),
    );
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (!!data && data[data.length - 1]?.length < messagesPerPage);

  const isLoadingMore =
    isLoading || (size > 0 && !!data && typeof data[size - 1] === "undefined");

  const messages = useMemo(() => (data ? data.flat() : undefined), [data]);

  const refetch = useMemo(
    () => async (scrollBehavior?: ScrollBehavior) => {
      setScrollBehavior(scrollBehavior);
      await mutate();
    },
    [mutate],
  );

  const fetchNextPage = () => setSize(size + 1);

  useCustomEvent(
    "messageupdate",
    async ({ chatId, status }) => {
      if (chat?.id !== chatId) return;

      refetch(
        status === "created" || status === "delivered" ? "smooth" : undefined,
      );
    },
    [refetch],
  );

  useCustomEvent("chatclick", () => setScrollBehavior("instant"));

  return (
    <MessageContext.Provider
      value={{
        messages,
        isLoading,
        isValidating,
        isLoadingMore,
        isReachingEnd,
        scrollBehavior,
        editingId,
        setScrollBehavior,
        refetch,
        fetchNextPage,
        setEditingId,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
