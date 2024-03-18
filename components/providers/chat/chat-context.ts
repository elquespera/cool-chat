import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  setIntercolutor: (intercolutor: ContactUser | null) => void;
  chat: ChatSelect | null;
  refetchChat: (intercolutor: ContactUser | null) => void;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  setIntercolutor: () => {},
  chat: null,
  refetchChat: () => {},
});

export const useChat = () => useContext(ChatContext);
