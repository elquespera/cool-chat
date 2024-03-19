"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { useChat } from "../chat/chat-context";
import { MessageContext } from "./message-context";

type MessageProviderProps = PropsWithChildren;

export function MessageProvider({ children }: MessageProviderProps) {
  const { chat } = useChat();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [scrollBehavior, setScrollBehavior] =
    useState<ScrollBehavior>("smooth");
  const [pending, setPending] = useState(false);

  const refetch = useMemo(
    () =>
      async (scroll: ScrollBehavior = "instant") => {
        if (!chat) {
          setMessages([]);
          return;
        }
        setPending(true);
        try {
          setScrollBehavior(scroll);
          setMessages(await getMessagesByChatId(chat.id));
        } finally {
          setPending(false);
        }
      },
    [chat],
  );

  useCustomEvent(
    "messageupdate",
    async ({ chatId, status }) => {
      if (chat?.id !== chatId) return;

      switch (status) {
        case "delivered":
        case "created":
          refetch("instant");
          break;
        default:
          refetch("smooth");
      }
    },
    [chat],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <MessageContext.Provider
      value={{ messages, pending, refetch, scrollBehavior }}
    >
      {children}
    </MessageContext.Provider>
  );
}
