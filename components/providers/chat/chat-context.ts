import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect, OpenChat } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  chat: ChatSelect | null;

  openChats?: OpenChat[];
  refetchOpenChats: () => Promise<OpenChat[] | void | undefined>;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  chat: null,
  refetchOpenChats: () => Promise.resolve(),
});

export const useChat = () => useContext(ChatContext);
