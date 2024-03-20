import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

export type ChatScroll = "none" | "smooth";

type MessageContextType = {
  messages?: MessageWithAuthor[];
  isLoading: boolean;
  refetch: (chatScroll?: ChatScroll) => Promise<void>;
  chatScroll?: ChatScroll;
};

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  isLoading: false,
  refetch: () => new Promise(() => {}),
});

export const useMessages = () => useContext(MessageContext);
