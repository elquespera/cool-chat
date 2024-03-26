"use client";

import { routes } from "@/constants/routes";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import { useChat } from "@/components/providers/chat/chat-context";

const maxMessages = 10;

type StreamEntry = { content?: string; message_id?: string };

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
  const [reader, setReader] =
    useState<ReadableStreamDefaultReader<Uint8Array>>();
  const isAssistant = interlocutor?.role === "assistant";

  const generateResponse = useCallback(
    async (chatId: string, regenerate = false) => {
      const doGenerate = async () => {
        if (!isAssistant || !assistant || isStreaming) return "";
        let content = "";
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
          if (!response.ok) return "error";

          dispatchCustomEvent("assistantresponse");

          const reader = response.body?.getReader();
          setReader(reader);
          if (!reader) return "error";
          const decoder = new TextDecoder("utf-8");
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const entries = decoder.decode(value).split("/n");
            entries.forEach((entry) => {
              try {
                const parsed = JSON.parse(entry) as StreamEntry;
                if (parsed.content) {
                  content += parsed.content;
                  setResponse(content);
                }
                if (parsed.message_id) {
                  setMessageId(parsed.message_id);
                }
              } catch {}
            });
          }

          dispatchCustomEvent("assistantresponse");
        } finally {
          setReader(undefined);
          setIsStreaming(false);
        }
      };
      await doGenerate();
      dispatchCustomEvent("assistantresponse");
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
