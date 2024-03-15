"use client";
import { getMessagesByChatId } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useEffect, useState } from "react";
import { useChat } from "../chat/chat-context";
import { MessageContext } from "./message-context";

type MessageProviderProps = PropsWithChildren;

export function MessageProvider({ children }: MessageProviderProps) {
  const { chat } = useChat();

  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [pending, setPending] = useState(false);

  const refetch = async () => {
    if (!chat) {
      setMessages([]);
      return;
    }
    setPending(true);
    try {
      setMessages(await getMessagesByChatId(chat.id));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  return (
    <MessageContext.Provider value={{ messages, pending, refetch }}>
      {children}
    </MessageContext.Provider>
  );
}
