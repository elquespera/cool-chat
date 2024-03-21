"use client";
import { findChatByIds } from "@/db/actions/chats";
import { getUserById } from "@/db/actions/users";
import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { useQueryParam } from "@/lib/hooks/use-query-param";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../auth/auth-context";
import { useChatWindow } from "../chat-window/chat-window-context";
import { ChatContext } from "./chat-context";
import { interlocutorKey } from "@/constants";

type ChatProviderProps = PropsWithChildren;

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const { setPage } = useChatWindow();
  const [interlocutor, setInterlocutor] = useState<ContactUser | null>(null);
  const [interlocutorId, setInterlocutorId] = useQueryParam(interlocutorKey);
  const [chat, setChat] = useState<ChatSelect | null>(null);

  const refetchChat = useCallback(
    async (interlocutor: ContactUser | null) => {
      const result =
        user && interlocutor
          ? await findChatByIds(user.id, interlocutor.id)
          : null;
      setChat(result ?? null);
    },
    [user],
  );

  useEffect(() => {
    const fetchInterlocutor = async () => {
      if (interlocutorId) {
        const result = await getUserById(interlocutorId);
        if (result.status === "ok") {
          setInterlocutor(result.data);
          refetchChat(result.data);
          setPage("chat");
        }
      } else {
        setInterlocutor(null);
        setChat(null);
        setPage("sidebar");
      }
    };

    fetchInterlocutor();
  }, [interlocutorId, setPage, refetchChat]);

  const value = useMemo(
    () => ({
      interlocutor,
      interlocutorId,
      chat,
      setChat,
      setInterlocutorId,
      refetchChat,
    }),
    [interlocutor, interlocutorId, setInterlocutorId, chat, refetchChat],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
