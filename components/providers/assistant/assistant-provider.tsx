"use client";

import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import { useChat } from "../chat/chat-context";
import { createMessage, getMessagesByChatId } from "@/db/actions/messages";
import ollama, { Message as OllamaMessage } from "ollama/browser";
import { ContactUser } from "@/db/schemas/auth";
import { useMessages } from "../message/message-context";

const model = "stablelm2";
const maxMessagesPerChat = 10;

type AssistantProviderProps = {
  assistant: ContactUser | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistant,
  children,
}: AssistantProviderProps) {
  const { interlocutor } = useChat();
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const isAssistant = interlocutor?.role === "assistant";
  const { refetch: refetchMessages } = useMessages();

  const generateResponse = useCallback(
    async (chatId: string) => {
      if (isStreaming || !isAssistant || !assistant) return;
      const rawMessages = await getMessagesByChatId(
        chatId,
        0,
        maxMessagesPerChat,
      );
      if (rawMessages.length < 1) return;

      let content = "";
      setResponse("");
      setIsStreaming(true);
      try {
        const messages: OllamaMessage[] = rawMessages.map(
          ({ content, author }) => ({
            content,
            role: author.role === "assistant" ? "assistant" : "user",
          }),
        );

        const responseStream = await ollama.chat({
          model,
          messages,
          stream: true,
        });

        for await (const part of responseStream) {
          content += part.message.content;
          setResponse(content);
        }

        const result = await createMessage({
          chatId,
          authorId: assistant.id,
          content,
        });

        if (result.ok) {
          refetchMessages("smooth");
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, isAssistant],
  );

  const value = useMemo(
    () => ({ assistant, isAssistant, response, isStreaming, generateResponse }),
    [isAssistant, response, isStreaming, generateResponse],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
