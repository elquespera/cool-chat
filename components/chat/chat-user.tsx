"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";

export function ChatUser() {
  const { interlocutor } = useChat();
  const { isMobile, setPage } = useChatWindow();

  return interlocutor ? (
    <div className="absolute flex h-20 w-full items-center border-b bg-background/80 p-4 backdrop-blur-sm">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="h-9 w-9"
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={() => setPage("sidebar")}
        />
      )}
      <UserInfo user={interlocutor} status size="lg" />
    </div>
  ) : null;
}
