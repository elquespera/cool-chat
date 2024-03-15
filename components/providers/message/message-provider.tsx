"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useEffect, useState } from "react";
import { useChat } from "../chat/chat-context";
import { useSocket } from "../socket/socket-context";
import { MessageContext } from "./message-context";

type MessageProviderProps = PropsWithChildren;

export function MessageProvider({ children }: MessageProviderProps) {
  const { chat } = useChat();
  const { socket } = useSocket();

  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [scrollBehavior, setScrollBehavior] =
    useState<ScrollBehavior>("smooth");
  const [pending, setPending] = useState(false);

  const refetch = async (scroll: ScrollBehavior = "instant") => {
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
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  useEffect(() => {
    socket?.on("messageModified", (chatId) => {
      if (chat?.id === chatId) refetch("smooth");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, socket]);

  return (
    <MessageContext.Provider
      value={{ messages, pending, refetch, scrollBehavior }}
    >
      {children}
    </MessageContext.Provider>
  );
}
