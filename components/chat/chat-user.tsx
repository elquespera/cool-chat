"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";

export function ChatUser() {
  const { interlocutor, setInterlocutorId } = useChat();
  const { isMobile } = useChatWindow();

  return interlocutor ? (
    <div className="absolute flex h-20 w-full items-center border-b bg-background/80 p-4 backdrop-blur-sm">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="mr-2 h-9 w-9"
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={() => setInterlocutorId(null)}
        />
      )}
      <UserInfo user={interlocutor} status size="lg" />
    </div>
  ) : null;
}
