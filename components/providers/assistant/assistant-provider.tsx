"use client";

import { ContactUser, UserSelect } from "@/db/schemas/auth";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { PropsWithChildren, useMemo, useState } from "react";
import { useChat } from "../chat/chat-context";
import { useContacts } from "../contacts/contact-context";
import { useMessages } from "../message/message-context";
import { AssistantContext } from "./assistant-context";
import { routes } from "@/constants/routes";

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
  const { refetchContacts } = useContacts();

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
        await refetchContacts();
      } finally {
        setReader(undefined);
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

// useCustomEvent(
//   "assistantresponse",
//   async ({ chatId, regenerate }) => {
//     if (isStreaming || !isAssistant || !assistant) return;
//     const rawMessages = await getMessagesByChatId(chatId, 0, maxMessages);

//     if (regenerate && rawMessages[0]?.authorId === assistant.id) {
//       await deleteMessage(rawMessages[0].id);
//       await refetchMessages();
//     }

//     if (!rawMessages.length) return;

//     let content = "";
//     const id = crypto.randomUUID();
//     setResponse("");
//     setMessageId(id);
//     setIsStreaming(true);
//     try {
//       const messages: OllamaMessage[] = rawMessages
//         .map(({ content, author }) => ({
//           content,
//           role: author.role === "assistant" ? "assistant" : "user",
//         }))
//         .toReversed();

//       const responseStream = await ollama.chat({
//         model,
//         messages,
//         stream: true,
//       });

//       setAi(ollama);

//       // const responseStream = mockAssistantResponse();

//       for await (const part of responseStream) {
//         content += part.message.content;
//         setResponse(content);
//       }
//     } catch (e) {
//       console.log(String(e));
//     } finally {
//       await createMessage({ id, chatId, authorId: assistant.id, content });
//       await refetchMessages("smooth");
//       await refetchContacts();
//       setIsStreaming(false);
//     }
//   },
//   [isStreaming, isAssistant, assistant, refetchMessages, refetchContacts],
// );
