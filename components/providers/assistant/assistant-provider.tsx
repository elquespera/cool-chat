"use client";

import { useChat } from "@/components/providers/chat/chat-context";
import { AssistantType, assistantInfo } from "@/constants/assistants";
import { routes } from "@/constants/routes";
import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { AssistantContext } from "./assistant-context";
import { AssistantError, readAssistantStream } from "./assistant-utils";

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
  const [controller, setController] = useState<AbortController>();
  const [assistantType, setAssistantType] = useState<AssistantType>("qwen");

  const assistant = assistants?.[assistantType];
  const isAssistant = interlocutor?.role === "assistant";

  const getAssistantFromChat = useCallback(
    ({ userOneId, userTwoId }: ChatSelect, model: AssistantType | null) => {
      if (model) return model;
      const anotherUserId = userOneId === user?.id ? userTwoId : userOneId;
      return assistantInfo?.[anotherUserId as AssistantType]?.id ?? null;
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

        const model = getAssistantFromChat(chat, defautModel) as AssistantType;

        if (!model) throw new AssistantError("model-not-defined");

        setAssistantType(model);

        setIsStreaming(true);
        try {
          const controller = new AbortController();
          setController(controller);

          const response = await fetch(routes.apiAssistant, {
            method: "POST",
            signal: controller.signal,
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
          if (!reader) throw new AssistantError("network-issue");

          await readAssistantStream(reader, setResponse, setMessageId);

          await refechMessages("instant");
          await refechChats();
        } finally {
          setController(undefined);
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
        }
      }
    },
    [assistants, isAssistant, isStreaming, getAssistantFromChat],
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
      abortResponse: () => controller?.abort(),
      setError,
    }),
    [
      isAssistant,
      isStreaming,
      streamedMessage,
      assistantChat,
      error,
      controller,
      generateResponse,
    ],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}
