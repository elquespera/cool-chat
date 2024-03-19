import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type MessageContextType = {
  messages: MessageWithAuthor[];
  pending: boolean;
  refetch: (scrollBehavior?: ScrollBehavior) => Promise<void>;
  scrollBehavior?: ScrollBehavior;
};

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  pending: false,
  refetch: () => new Promise(() => {}),
});

export const useMessages = () => useContext(MessageContext);
