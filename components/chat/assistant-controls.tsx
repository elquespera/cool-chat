import { assistantId } from "@/constants";
import { routes } from "@/constants/routes";
import { deleteChat } from "@/db/actions/chats";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../common/confirm-dialog";
import { IconButton } from "../common/icon-button";
import { MagicIcon } from "../icons/magic-icon";
import { RefreshIcon } from "../icons/refresh-icon";
import { StopIcon } from "../icons/stop-icon";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";

export function AssistantControls() {
  const router = useRouter();
  const { chat } = useChat();
  const { isAssistant, isStreaming, generateResponse, abortResponse } =
    useAssistant();
  const { refetchMessages } = useMessages();

  const handleRegenerateResponse = () => {
    if (!chat) return;
    generateResponse(chat.id, refetchMessages, true);
  };

  const handleResetChat = async () => {
    if (!isAssistant || !chat) return;
    await deleteChat(chat.id);
    router.push(`${routes.user}/${assistantId}`);
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
            onClick={handleRegenerateResponse}
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
