"use client";

import { useChat } from "@/components/providers/chat/chat-context";
import { routes } from "@/constants/routes";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AssistantContext } from "./assistant-context";
import {
  AssistantStreamReader,
  readAssistantStream,
  AssistantError,
} from "./assistant-utils";

const maxMessages = 10;

type AssistantProviderProps = {
  assistant: ContactUser | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistant,
  children,
}: AssistantProviderProps) {
  const { interlocutor } = useChat();
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatId, setChatId] = useState<string>();
  const [error, setError] = useState<string>();
  const [response, setResponse] = useState("");
  const [messageId, setMessageId] = useState("");
  const [reader, setReader] = useState<AssistantStreamReader>();

  const isAssistant = interlocutor?.role === "assistant";

  const generateResponse = useCallback(
    async (
      chatId: string,
      refechMessages: (scrollBehavior?: ScrollBehavior) => Promise<void>,
      refechChats: () => Promise<void>,
      regenerate = false,
    ) => {
      const doGenerate = async () => {
        if (isStreaming) throw new AssistantError("alreadyInUse");
        setResponse("");
        setChatId(chatId);
        setIsStreaming(true);
        try {
          const response = await fetch(routes.apiAssistant, {
            method: "POST",
            body: JSON.stringify({
              chatId,
              regenerate,
              maxMessages,
            }),
          });
          if (!response.ok) throw new AssistantError("network");

          refechMessages("instant");

          const reader = response.body?.getReader();
          setReader(reader);
          if (!reader) throw new AssistantError("network");

          await readAssistantStream(reader, setResponse, setMessageId);

          await refechMessages("instant");
          await refechChats();
        } finally {
          setReader(undefined);
          setIsStreaming(false);
        }
      };

      if (!isAssistant || !assistant) return;

      setError(undefined);
      try {
        await doGenerate();
      } catch (e) {
        if (e instanceof AssistantError) {
          setError(e.message);
        } else {
          console.error(e);
        }
      }
    },
    [assistant, isAssistant, isStreaming],
  );

  const streamedMessage: MessageWithAuthor = useMemo(
    () => ({
      id: messageId || "streaming-response",
      chatId: chatId ?? "",
      author: assistant as UserSelect,
      authorId: assistant?.id ?? "",
      content: response,
      status: "delivered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [messageId, response, assistant, chatId],
  );

  const value = useMemo(
    () => ({
      isAssistant,
      isStreaming,
      streamedMessage,
      chatId,
      error,
      generateResponse,
      abortResponse: () => reader?.cancel(),
      setError,
    }),
    [
      isAssistant,
      isStreaming,
      streamedMessage,
      chatId,
      error,
      reader,
      generateResponse,
    ],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
