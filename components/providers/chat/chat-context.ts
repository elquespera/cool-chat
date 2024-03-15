import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  setIntercolutor: (intercolutor: ContactUser | null) => void;
  chat: ChatSelect | null;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  setIntercolutor: () => {},
  chat: null,
});

export const useChat = () => useContext(ChatContext);
