"use client";

import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import { useChat } from "../chat/chat-context";
import { createMessage, getMessagesByChatId } from "@/db/actions/messages";
import ollama, { Message as OllamaMessage } from "ollama/browser";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { useMessages } from "../message/message-context";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { mockAssistantResponse } from "@/lib/mock-assistant";
import { useContacts } from "../contacts/contact-context";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";

const model = "stablelm2";
const maxMessages = 10;

type AssistantProviderProps = {
  assistant: ContactUser | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistant,
  children,
}: AssistantProviderProps) {
  const { interlocutor, chat } = useChat();
  const { refetchMessages } = useMessages();
  const { refetchContacts } = useContacts();

  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [messageId, setMessageId] = useState("");

  const isAssistant = interlocutor?.role === "assistant";

  useCustomEvent(
    "assistantresponse",
    async ({ chatId }) => {
      if (isStreaming || !isAssistant || !assistant) return;
      const rawMessages = await getMessagesByChatId(chatId, 0, maxMessages);
      if (rawMessages.length < 1) return;

      let content = "";
      const id = crypto.randomUUID();
      setResponse("");
      setMessageId(id);
      setIsStreaming(true);
      try {
        const messages: OllamaMessage[] = rawMessages.map(
          ({ content, author }) => ({
            content,
            role: author.role === "assistant" ? "assistant" : "user",
          }),
        );

        // const responseStream = await ollama.chat({
        //   model,
        //   messages,
        //   stream: true,
        // });

        const responseStream = mockAssistantResponse();

        for await (const part of responseStream) {
          content += part.message.content;
          setResponse(content);
        }

        await createMessage({ id, chatId, authorId: assistant.id, content });

        await refetchMessages("smooth");
        await refetchContacts();
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, isAssistant, assistant, refetchMessages, refetchContacts],
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
    [messageId, response, chat, assistant],
  );

  const value = useMemo(
    () => ({
      isAssistant,
      isStreaming,
      streamedMessage,
    }),
    [isAssistant, isStreaming, streamedMessage],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}