"use client";

import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import ConfirmDialog from "../common/confirm-dialog";
import { IconButton } from "../common/icon-button";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";
import { deleteChat } from "@/db/actions/chats";

export function ChatUser() {
  const { interlocutor, setInterlocutorId, chat } = useChat();
  const { isMobile } = useChatWindow();
  const { isAssistant } = useAssistant();

  const handleResetChat = async () => {
    if (!isAssistant || !chat) return;
    const result = await deleteChat(chat.id);
    setInterlocutorId(null);
  };

  return interlocutor ? (
    <div className="absolute flex h-20 w-full items-center gap-2 border-b bg-background/80 p-4 backdrop-blur-sm">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="h-9 w-9"
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={() => setInterlocutorId(null)}
        />
      )}
      <UserInfo user={interlocutor} status size="lg" />

      {isAssistant && (
        <ConfirmDialog
          title="Reset Chat with Assistant"
          description="Are you sure you want to reset your conversation with Assistant by deleting its contents? This action cannot be undone."
          onSuccess={handleResetChat}
        >
          <IconButton
            variant="outline"
            className="ml-auto"
            icon={<ReloadIcon />}
          >
            Reset chat
          </IconButton>
        </ConfirmDialog>
      )}
    </div>
  ) : null;
}
