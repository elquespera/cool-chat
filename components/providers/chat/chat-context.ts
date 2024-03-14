import type { ContactUser } from "@/db/schemas/auth";
import { createContext, useContext } from "react";

type ChatContextType = {
  interlocutor: ContactUser | null;
  setIntercolutor: (intercolutor: ContactUser | null) => void;
};

export const ChatContext = createContext<ChatContextType>({
  interlocutor: null,
  setIntercolutor: () => {},
});

export const useChat = () => useContext(ChatContext);
