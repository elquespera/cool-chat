import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type MessageContextType = {
  messages: MessageWithAuthor[];
  pending: boolean;
  refetch: () => void;
};

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  pending: false,
  refetch: () => {},
});

export const useMessages = () => useContext(MessageContext);
