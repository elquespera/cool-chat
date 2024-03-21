import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { createContext, useContext } from "react";

type AssistantContextType = {
  assistant: ContactUser | null;
  isAssistant: boolean;
  response: string;
  isStreaming: boolean;
  generateResponse: (chatId: string) => void;
};

export const AssistantContext = createContext<AssistantContextType>({
  isAssistant: false,
  response: "",
  isStreaming: false,
  assistant: null,
  generateResponse: () => {},
});

export const useAssistant = () => useContext(AssistantContext);
