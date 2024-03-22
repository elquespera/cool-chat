import { MagicWandIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { dispatchCustomEvent } from "@/lib/custom-event";

export function AssistantResponse() {
  const { chat } = useChat();
  const { isAssistant, isStreaming } = useAssistant();

  const handleRegenerate = () => {
    if (!chat) return;
    dispatchCustomEvent("assistantresponse", {
      chatId: chat.id,
      regenerate: true,
    });
  };

  return (
    isAssistant && (
      <div className="flex justify-center gap-3">
        {isStreaming ? (
          <IconButton size="sm" variant="destructive">
            Stop
          </IconButton>
        ) : (
          <IconButton
            size="sm"
            reverse
            onClick={handleRegenerate}
            icon={<MagicWandIcon className="ml-1" />}
          >
            Regenerate
          </IconButton>
        )}
      </div>
    )
  );
}
