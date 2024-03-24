"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { OpenChatsContext } from "./open-chats-context";
import useSWR from "swr";
import { useAuth } from "../auth/auth-context";
import { getOpenChats } from "@/db/actions/chats";
import { OpenChat } from "@/db/schemas/chats";
import { useOpenChatsEvents } from "./use-open-chats-events";
import { useSocket } from "../socket/socket-context";
import { markMessagesDelivered } from "@/db/actions/messages";

export function OpenChatsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { data: openChats, mutate: refetchOpenChats } = useSWR<OpenChat[]>(
    user?.id,
    async () => {
      const result = await getOpenChats();
      return result.ok ? result.data : [];
    },
  );

  const value = useMemo(
    () => ({ openChats, refetchOpenChats }),
    [openChats, refetchOpenChats],
  );

  useOpenChatsEvents(openChats, refetchOpenChats);

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
  return (
    <OpenChatsContext.Provider value={value}>
      {children}
    </OpenChatsContext.Provider>
  );
}
