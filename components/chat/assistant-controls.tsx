import { routes } from "@/constants/routes";
import { deleteChat } from "@/db/actions/chats";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../common/confirm-dialog";
import { IconButton } from "../common/icon-button";
import { MagicIcon } from "../icons/magic-icon";
import { StopIcon } from "../icons/stop-icon";
import { TrashIcon } from "../icons/trash-icon";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";

export function AssistantControls() {
  const router = useRouter();
  const { chat, refetchOpenChats } = useChat();
  const {
    isAssistant,
    isStreaming,
    assistantChat,
    generateResponse,
    abortResponse,
  } = useAssistant();
  const { refetchMessages } = useMessages();

  const isOwnChat = assistantChat?.id === chat?.id;

  const handleRegenerateResponse = () => {
    if (!chat) return;
    generateResponse(chat, null, refetchMessages, refetchOpenChats, true);
  };

  const handleAbortResponse = () => {
    abortResponse();
    refetchOpenChats();
    refetchMessages();
  };

  const handleDeleteChat = async () => {
    if (!isAssistant || !chat) return;
    const result = await deleteChat(chat.id);
    if (result.ok) {
      router.push(`${routes.home}`);
      refetchOpenChats();
    }
  };

  return (
    isAssistant && (
      <>
        {isOwnChat && isStreaming ? (
          <IconButton
            size="sm"
            variant="destructive"
            reverse
            icon={<StopIcon className="h-6 w-6" />}
            onClick={handleAbortResponse}
          >
            Stop
          </IconButton>
        ) : (
          <>
            <IconButton
              className="group"
              aria-label="Regenerate response"
              toolTip="Regenerate response"
              toolTipOffset={10}
              disabled={isStreaming}
              variant="ghost"
              onClick={handleRegenerateResponse}
              icon={<MagicIcon className="h-5 w-5 group-hover:text-primary" />}
            />
            <ConfirmDialog
              title="Delete Chat"
              description="Are you sure you want to delete this conversation with the assistant? This action cannot be undone."
              onSuccess={handleDeleteChat}
            >
              <IconButton
                className="group"
                variant="ghost"
                aria-label="Delete chat"
                toolTip="Delete chat"
                toolTipOffset={10}
                icon={
                  <TrashIcon className="h-5 w-5 group-hover:text-primary" />
                }
              />
            </ConfirmDialog>
          </>
        )}
      </>
    )
  );
}
