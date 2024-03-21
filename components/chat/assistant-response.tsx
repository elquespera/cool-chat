import { useMemo } from "react";
import { MessageItem } from "../message/message-item";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { Button } from "../ui/button";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { UserSelect } from "@/db/schemas/auth";

export function AssistantResponse() {
  const { assistant, isStreaming, response, generateResponse } = useAssistant();
  const { chat } = useChat();

  const message: MessageWithAuthor = useMemo(
    () => ({
      id: "live-response",
      chatId: chat?.id ?? "",
      author: assistant as UserSelect,
      authorId: assistant?.id ?? "",
      content: response,
      status: "delivered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    [response, chat],
  );

  return (
    <div>
      {isStreaming && (
        <MessageItem message={message} series={false} streaming />
      )}
      <Button onClick={() => chat && generateResponse(chat.id)}>
        Regenerate
      </Button>
    </div>
  );
}
