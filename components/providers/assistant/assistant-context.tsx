import { ThemeColor, defaultColor } from "@/constants";
import { createContext, useContext } from "react";

type AssistantContextType = {
  isStreaming: boolean;
  generateResponse: (chatId: string) => void;
};

export const AssistantContext = createContext<AssistantContextType>({
  isStreaming: false,
  generateResponse: () => {},
});

export const useAssistant = () => useContext(AssistantContext);
