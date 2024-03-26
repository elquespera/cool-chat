"use client";

import { useChat } from "@/components/providers/chat/chat-context";
import { routes } from "@/constants/routes";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import { AssistantStreamReader, readAssistantStream } from "./assistant-utils";

const maxMessages = 10;

type AssistantProviderProps = {
  assistant: ContactUser | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistant,
  children,
}: AssistantProviderProps) {
  const { chat, interlocutor } = useChat();
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [messageId, setMessageId] = useState("");
  const [reader, setReader] = useState<AssistantStreamReader>();

  const isAssistant = interlocutor?.role === "assistant";

  const generateResponse = useCallback(
    async (
      chatId: string,
      messageCallback: (scrollBehavior?: ScrollBehavior) => Promise<void>,
      regenerate = false,
    ) => {
      if (!isAssistant || !assistant || isStreaming) return;
      setResponse("");
      setIsStreaming(true);
      try {
        const response = await fetch(routes.assistant, {
          method: "POST",
          body: JSON.stringify({
            chatId,
            regenerate,
            maxMessages,
          }),
        });
        if (!response.ok) return;

        messageCallback("instant");

        const reader = response.body?.getReader();
        setReader(reader);
        if (!reader) return;

        await readAssistantStream(reader, setResponse, setMessageId);

        await messageCallback("instant");
      } finally {
        setReader(undefined);
        setIsStreaming(false);
      }
    },
    [assistant, isAssistant, isStreaming],
  );

  const streamedMessage: MessageWithAuthor = useMemo(
    () => ({
      id: messageId || "streaming-response",
      chatId: chat?.id ?? "",
      author: assistant as UserSelect,
      authorId: assistant?.id ?? "",
      content: response,
      status: "delivered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [messageId, response, assistant, chat?.id],
  );

  const value = useMemo(
    () => ({
      isAssistant,
      isStreaming,
      streamedMessage,
      generateResponse,
      abortResponse: () => reader?.cancel(),
    }),
    [isAssistant, isStreaming, streamedMessage, reader, generateResponse],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
