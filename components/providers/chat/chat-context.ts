import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect, OpenChat } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  setInterlocutor: (interlocutor: ContactUser | null) => void;
  chat: ChatSelect | null;
  setChat: (chat: ChatSelect | null) => void;
  typingContacts: string[];

  openChats?: OpenChat[];
  refetchOpenChats: () => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  chat: null,
  typingContacts: [],
  setInterlocutor: () => {},
  setChat: () => {},
  refetchOpenChats: () => Promise.resolve(),
});

export const useChat = () => useContext(ChatContext);
