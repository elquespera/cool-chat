"use client";
import { findChatByIds } from "@/db/actions/chats";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { PropsWithChildren, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { ChatContext } from "./chat-context";

type ChatProviderProps = PropsWithChildren;

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const [interlocutor, setIntercolutorInternal] = useState<ContactUser | null>(
    null,
  );
  const [chat, setChat] = useState<ChatSelect | null>(null);

  const refetchChat = async (interlocutor: ContactUser | null) => {
    const result =
      user && interlocutor
        ? await findChatByIds(user.id, interlocutor.id)
        : null;
    setChat(result ?? null);
  };

  const setIntercolutor = async (contact: ContactUser | null) => {
    setIntercolutorInternal(contact);
    refetchChat(contact);
  };

  return (
    <ChatContext.Provider
      value={{ interlocutor, setIntercolutor, chat, refetchChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}
