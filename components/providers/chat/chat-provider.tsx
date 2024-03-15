"use client";
import { findChatByIds } from "@/db/actions/chats";
import { getMessagesByChatId } from "@/db/actions/messages";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { ChatContext } from "./chat-context";

type ChatProviderProps = PropsWithChildren;

export function ChatProvider({ children }: ChatProviderProps) {
  const [interlocutor, setIntercolutorInternal] = useState<ContactUser | null>(
    null,
  );
  const [chat, setChat] = useState<ChatSelect | null>(null);
  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [pending, setPending] = useState(false);
  const { user } = useAuth();

  const setIntercolutor = async (contact: ContactUser | null) => {
    setPending(true);
    try {
      setIntercolutorInternal(contact);
      if (contact && user) {
        const result = await findChatByIds(user.id, contact.id);
        setChat(result ?? null);
      }
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
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

    fetchMessages();
  }, [chat]);

  return (
    <ChatContext.Provider
      value={{ interlocutor, setIntercolutor, chat, messages, pending }}
    >
      {children}
    </ChatContext.Provider>
  );
}
