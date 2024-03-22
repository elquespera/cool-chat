import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type AssistantContextType = {
  isAssistant: boolean;
  isStreaming: boolean;
  streamedMessage: MessageWithAuthor;
};

export const AssistantContext = createContext<AssistantContextType>({
  isAssistant: false,
  isStreaming: false,
  streamedMessage: {} as MessageWithAuthor,
});

export const useAssistant = () => useContext(AssistantContext);
