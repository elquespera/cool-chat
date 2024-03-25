import { deleteChat } from "@/db/actions/chats";
import { dispatchCustomEvent } from "@/lib/custom-event";
import ConfirmDialog from "../common/confirm-dialog";
import { IconButton } from "../common/icon-button";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { StopIcon } from "../icons/stop-icon";
import { MagicIcon } from "../icons/magic-icon";
import { RefreshIcon } from "../icons/refresh-icon";

export function AssistantControls() {
  const { chat } = useChat();
  const { isAssistant, isStreaming, abortResponse } = useAssistant();

  const handleRegenerate = () => {
    if (!chat) return;
    dispatchCustomEvent("assistantresponse", {
      chatId: chat.id,
      regenerate: true,
    });
  };

  const handleResetChat = async () => {
    if (!isAssistant || !chat) return;
    // await deleteChat(chat.id);
    // setInterlocutorId(null);
  };

  return (
    isAssistant && (
      <>
        {isStreaming ? (
          <IconButton
            size="sm"
            variant="destructive"
            reverse
            icon={<StopIcon className="h-6 w-6" />}
            onClick={abortResponse}
          >
            Stop
          </IconButton>
        ) : (
          <IconButton
            className="group"
            aria-label="Regenerate response"
            toolTip="Regenerate response"
            toolTipOffset={10}
            variant="ghost"
            onClick={handleRegenerate}
            icon={<MagicIcon className="h-5 w-5 group-hover:text-primary" />}
          />
        )}

        <ConfirmDialog
          title="Reset Chat with Assistant"
          description="Are you sure you want to reset your conversation with Assistant by deleting its contents? This action cannot be undone."
          onSuccess={handleResetChat}
        >
          <IconButton
            className="group"
            variant="ghost"
            aria-label="Reset chat"
            toolTip="Reset chat"
            toolTipOffset={10}
            icon={<RefreshIcon className="h-5 w-5 group-hover:text-primary" />}
          />
        </ConfirmDialog>
      </>
    )
  );
}
