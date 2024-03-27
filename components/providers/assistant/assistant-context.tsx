import { AssistantType } from "@/constants/assistants";
import { ChatSelect } from "@/db/schemas/chats";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type AssistantContextType = {
  isAssistant: boolean;
  isStreaming: boolean;
  streamedMessage: MessageWithAuthor;
  assistantChat?: ChatSelect;
  error?: string;
  setError: (error?: string) => void;
  generateResponse: (
    chat: ChatSelect,
    model: AssistantType | null,
    refetchMessages: (scrollBehavior?: ScrollBehavior) => Promise<void>,
    refetchChats: () => Promise<void>,
    regenerate?: boolean,
  ) => Promise<void>;
  abortResponse: () => void;
};

export const AssistantContext = createContext<AssistantContextType>({
  isAssistant: false,
  isStreaming: false,
  streamedMessage: {} as MessageWithAuthor,
  generateResponse: () => Promise.resolve(),
  abortResponse: () => {},
  setError: () => {},
});

export const useAssistant = () => useContext(AssistantContext);
