import { IconButton } from "../common/icon-button";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";

export function AssistantResponse() {
  const { chat } = useChat();
  const { isAssistant } = useAssistant();

  return (
    isAssistant && (
      <div className="flex justify-center gap-3">
        <IconButton size="sm">Regenerate</IconButton>
        <IconButton size="sm" variant="destructive">
          Stop
        </IconButton>
      </div>
    )
  );
}
