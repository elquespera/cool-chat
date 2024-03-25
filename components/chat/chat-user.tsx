"use client";

import { IconButton } from "../common/icon-button";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";
import { AssistantControls } from "./assistant-controls";
import { GlassPanel } from "../common/glass-panel";
import { UserControls } from "./user-controls";
import { ArrowUpIcon } from "../icons/arrow-up-icon";

export function ChatUser() {
  const { interlocutor } = useChat();
  const { isMobile } = useChatWindow();

  return interlocutor ? (
    <GlassPanel className="flex h-20 items-center gap-2 shadow-sm">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="h-9 w-9"
          aria-label="Back to contacts"
          icon={<ArrowUpIcon className="h-5 w-5 -rotate-90" />}
          // onClick={() => setInterlocutorId(null)}
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
