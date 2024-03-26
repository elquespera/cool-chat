"use client";
import { useChat } from "@/components/providers/chat/chat-context";
import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { useLayoutEffect } from "react";

type InjectChatInfoProps = {
  interlocutor: ContactUser | null;
  chat: ChatSelect | null;
};

export function InjectChatInfo({ interlocutor, chat }: InjectChatInfoProps) {
  const { setInterlocutor, setChat } = useChat();

  useLayoutEffect(() => {
    setInterlocutor(interlocutor);
    setChat(chat);
  }, [interlocutor, chat, setInterlocutor, setChat]);

  return null;
}
