"use client";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { PropsWithChildren, useEffect } from "react";
import { ChatContext } from "./chat-context";
import { useOpenChats } from "../open-chats/open-chats-context";

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

  useEffect(() => setSelectedChat(chat), [chat]);
  useEffect(() => setSelectedContact(interlocutor), [interlocutor]);

  return (
    <ChatContext.Provider value={{ interlocutor, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
