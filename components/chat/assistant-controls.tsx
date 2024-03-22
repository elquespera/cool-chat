import { deleteChat } from "@/db/actions/chats";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { MagicWandIcon, ResetIcon, StopIcon } from "@radix-ui/react-icons";
import ConfirmDialog from "../common/confirm-dialog";
import { IconButton } from "../common/icon-button";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";

export function AssistantControls() {
  const { chat, setInterlocutorId } = useChat();
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
    await deleteChat(chat.id);
    setInterlocutorId(null);
  };

  return (
    isAssistant && (
      <div className="ml-auto flex justify-center gap-3">
        {isStreaming ? (
          <IconButton
            size="sm"
            variant="destructive"
            reverse
            icon={<StopIcon />}
            onClick={abortResponse}
          >
            Stop
          </IconButton>
        ) : (
          <IconButton
            reverse
            toolTip="Regenerate response"
            toolTipOffset={10}
            variant="ghost"
            onClick={handleRegenerate}
            icon={<MagicWandIcon />}
          />
        )}

        <ConfirmDialog
          title="Reset Chat with Assistant"
          description="Are you sure you want to reset your conversation with Assistant by deleting its contents? This action cannot be undone."
          onSuccess={handleResetChat}
        >
          <IconButton
            variant="ghost"
            toolTip="Reset chat"
            toolTipOffset={10}
            icon={<ResetIcon />}
          />
        </ConfirmDialog>
      </div>
    )
  );
}
