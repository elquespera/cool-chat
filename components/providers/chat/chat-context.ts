import type { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  interlocutorId: string | null;
  setInterlocutorId: (interlocutor: string | null) => void;
  chat: ChatSelect | null;
  refetchChat: (intercolutor: ContactUser | null) => Promise<void>;
  isAssistant: boolean;
  isStreaming: boolean;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  interlocutorId: null,
  setInterlocutorId: () => {},
  chat: null,
  refetchChat: () => new Promise((resolve) => resolve()),
  isAssistant: false,
  isStreaming: false,
});

export const useChat = () => useContext(ChatContext);
