"use client";

import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import { useChat } from "../chat/chat-context";

export function AssistantProvider({ children }: PropsWithChildren) {
  const { isAssistant } = useChat();
  const [isStreaming, setIsStreaming] = useState(false);

  const generateResponse = useCallback(
    (chatId: string) => {
      if (isStreaming || !isAssistant) return;
      console.log("generate response");
    },
    [isStreaming, isAssistant],
  );

  const value = useMemo(
    () => ({ isStreaming, generateResponse }),
    [isStreaming, generateResponse],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
