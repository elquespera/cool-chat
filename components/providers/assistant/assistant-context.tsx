import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type AssistantContextType = {
  isAssistant: boolean;
  isStreaming: boolean;
  streamedMessage: MessageWithAuthor;
  generateResponse: (chatId: string, regenerate?: boolean) => void;
  abortResponse: () => void;
};

export const AssistantContext = createContext<AssistantContextType>({
  isAssistant: false,
  isStreaming: false,
  streamedMessage: {} as MessageWithAuthor,
  generateResponse: () => {},
  abortResponse: () => {},
});

export const useAssistant = () => useContext(AssistantContext);
