import { MessageItem } from "../message/message-item";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { Button } from "../ui/button";

export function AssistantResponse() {
  const { chat } = useChat();
  const { isAssistant, generateResponse } = useAssistant();

  return (
    isAssistant && (
      <div>
        <Button onClick={() => chat && generateResponse(chat.id)}>
          Regenerate
        </Button>
      </div>
    )
  );
}
