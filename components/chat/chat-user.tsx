"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";
import { AssistantControls } from "./assistant-controls";
import { GlassPanel } from "../common/glass-panel";

export function ChatUser() {
  const { interlocutor, setInterlocutorId } = useChat();
  const { isMobile } = useChatWindow();

  return interlocutor ? (
    <GlassPanel className="flex h-20 items-center gap-2">
      {isMobile && (
        <IconButton
          variant="ghost"
          className="h-9 w-9"
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={() => setInterlocutorId(null)}
        />
      )}
      <UserInfo user={interlocutor} status size="lg" />
      <AssistantControls />
    </GlassPanel>
  ) : null;
}
