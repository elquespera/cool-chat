"use client";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { ChatContext } from "./chat-context";
import { getOpenChats } from "@/db/actions/chats";
import { markMessagesDelivered } from "@/db/actions/messages";
import { OpenChat } from "@/db/schemas/chats";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useAuth } from "../auth/auth-context";
import { useSocket } from "../socket/socket-context";
import { useChatEvents } from "./use-chat-events";

export function ChatProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { data: openChats, mutate: refetchOpenChats } = useSWR<OpenChat[]>(
    user?.id,
    async () => {
      const result = await getOpenChats();
      return result.ok ? result.data : [];
    },
  );

  const [chat, setChat] = useState<ChatSelect | null>(null);
  const [interlocutor, setInterlocutor] = useState<ContactUser | null>(null);

  useChatEvents(openChats, refetchOpenChats);

  useEffect(() => {
    if (!user || !openChats) return;

    openChats.forEach(async (chat) => {
      const result = await markMessagesDelivered(chat.id);
      if (!result.ok) return;

      const { authorId, chatId, id } = result.data;
      socket?.emit("messageUpdate", {
        messageId: id,
        chatId,
        authorId,
        interlocutorId: user.id,
        status: "delivered",
      });
    });
  }, [openChats, socket, user]);

  const value = useMemo(
    () => ({
      interlocutor,
      setInterlocutor,
      chat,
      setChat,
      openChats,
      refetchOpenChats,
    }),
    [interlocutor, chat, openChats, refetchOpenChats],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
