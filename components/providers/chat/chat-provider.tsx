"use client";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { PropsWithChildren, useEffect } from "react";
import { useOpenChats } from "../open-chats/open-chats-context";
import { ChatContext } from "./chat-context";

type ChatProviderProps = {
  interlocutor: ContactUser;
  chat: ChatSelect | null;
} & PropsWithChildren;

export function ChatProvider({
  interlocutor,
  chat,
  children,
}: ChatProviderProps) {
  const { setSelectedChat, setSelectedContact } = useOpenChats();

  useEffect(
    () => setSelectedContact(interlocutor),
    [interlocutor, setSelectedContact],
  );
  useEffect(() => setSelectedChat(chat), [chat, setSelectedChat]);

  return (
    <ChatContext.Provider value={{ interlocutor, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
