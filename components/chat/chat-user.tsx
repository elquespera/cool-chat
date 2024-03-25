"use client";

import { GlassPanel } from "../common/glass-panel";
import { IconButton } from "../common/icon-button";
import { ArrowUpIcon } from "../icons/arrow-up-icon";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { useOpenChats } from "../providers/open-chats/open-chats-context";
import { UserInfo } from "../user/user-info";
import { AssistantControls } from "./assistant-controls";
import { UserControls } from "./user-controls";

export function ChatUser() {
  const { interlocutor } = useChat();
  const { isMobile } = useChatWindow();
  const { clearSelected } = useOpenChats();

  return interlocutor ? (
    <GlassPanel className="flex h-20 items-center gap-2 shadow-sm">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="h-9 w-9"
          aria-label="Back to contacts"
          icon={<ArrowUpIcon className="h-5 w-5 -rotate-90" />}
          onClick={clearSelected}
        />
      )}
      <UserInfo user={interlocutor} status size="lg" />
      <div className="ml-auto flex justify-center gap-3">
        <UserControls />
        <AssistantControls />
      </div>
    </GlassPanel>
  ) : null;
}
