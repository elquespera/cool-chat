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
import { AssistantType } from "@/constants/assistants";
import { ChatSelect } from "@/db/schemas/chats";
import { useAuth } from "../auth/auth-context";

const maxMessages = 10;

type AssistantProviderProps = {
  assistants: Record<AssistantType, ContactUser> | null;
} & PropsWithChildren;

export function AssistantProvider({
  assistants,
  children,
}: AssistantProviderProps) {
  const { user } = useAuth();
  const { interlocutor } = useChat();
  const [isStreaming, setIsStreaming] = useState(false);
  const [assistantChat, setAssistantChat] = useState<ChatSelect>();
  const [error, setError] = useState<string>();
  const [response, setResponse] = useState("");
  const [messageId, setMessageId] = useState("");
  const [reader, setReader] = useState<AssistantStreamReader>();
  const [assistantType, setAssistantType] = useState<AssistantType>("qwen");

  const assistant = assistants?.[assistantType];
  const isAssistant = interlocutor?.role === "assistant";

  const getAssistantFromChat = useCallback(
    ({ userOneId, userTwoId }: ChatSelect, model: AssistantType | null) => {
      if (model) return model;
      const anotherUserId = userOneId === user?.id ? userTwoId : userOneId;
      return assistants?.[anotherUserId as AssistantType]?.id ?? null;
    },
    [user],
  );

  const generateResponse = useCallback(
    async (
      chat: ChatSelect,
      defautModel: AssistantType | null,
      refechMessages: (scrollBehavior?: ScrollBehavior) => Promise<void>,
      refechChats: () => Promise<void>,
      regenerate = false,
    ) => {
      const doGenerate = async () => {
        setResponse("");
        setAssistantChat(chat);

        if (isStreaming) throw new AssistantError("already-in-se");

        const model = getAssistantFromChat(chat, defautModel);

        if (!model) throw new AssistantError("model-not-defined");

        setIsStreaming(true);
        try {
          const response = await fetch(routes.apiAssistant, {
            method: "POST",
            body: JSON.stringify({
              chatId: chat.id,
              model,
              regenerate,
              maxMessages,
            }),
          });
          if (!response.ok) throw new AssistantError("network-issue");

          refechMessages("instant");

          const reader = response.body?.getReader();
          setReader(reader);
          if (!reader) throw new AssistantError("network-issue");

          await readAssistantStream(reader, setResponse, setMessageId);

          await refechMessages("instant");
          await refechChats();
        } finally {
          setReader(undefined);
          setIsStreaming(false);
        }
      };

      if (!isAssistant || !assistants) return;

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
    [assistants, isAssistant, isStreaming],
  );

  const streamedMessage: MessageWithAuthor = useMemo(
    () => ({
      id: messageId || "streaming-response",
      chatId: assistantChat?.id ?? "",
      author: assistant as UserSelect,
      authorId: assistant?.id ?? "",
      content: response,
      status: "delivered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [messageId, response, assistant, assistantChat],
  );

  const value = useMemo(
    () => ({
      isAssistant,
      isStreaming,
      streamedMessage,
      assistantChat,
      error,
      generateResponse,
      abortResponse: () => reader?.cancel(),
      setError,
    }),
    [
      isAssistant,
      isStreaming,
      streamedMessage,
      assistantChat,
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
