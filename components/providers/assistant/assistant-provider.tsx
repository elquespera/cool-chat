"use client";

import { routes } from "@/constants/routes";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useMemo, useState } from "react";
import { useChat } from "../chat/chat-context";
import { useMessages } from "../message/message-context";
import { AssistantContext } from "./assistant-context";
import { useOpenChats } from "../open-chats/open-chats-context";

const maxMessages = 10;

type StreamEntry = { content?: string; message_id?: string };

type AssistantProviderProps = {
  assistant: ContactUser | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistant,
  children,
}: AssistantProviderProps) {
  const { interlocutor, chat } = useChat();
  const { refetchMessages } = useMessages();
  const { refetchOpenChats } = useOpenChats();

  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [messageId, setMessageId] = useState("");
  const [reader, setReader] =
    useState<ReadableStreamDefaultReader<Uint8Array>>();

  const isAssistant = interlocutor?.role === "assistant";

  useCustomEvent(
    "assistantresponse",
    async ({ chatId, regenerate }) => {
      if (isStreaming || !isAssistant || !assistant) return;
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

        await refetchMessages();

        const reader = response.body?.getReader();
        setReader(reader);
        if (!reader) return;
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
        await refetchMessages("smooth");
        await refetchOpenChats();
      } finally {
        setReader(undefined);
        setIsStreaming(false);
      }
    },
    [isStreaming, isAssistant, assistant, refetchMessages, refetchOpenChats],
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
      generateResponse: (chatId: string, regenerate = false) =>
        dispatchCustomEvent("assistantresponse", { chatId, regenerate }),
      abortResponse: () => reader?.cancel(),
    }),
    [isAssistant, isStreaming, streamedMessage, reader],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
