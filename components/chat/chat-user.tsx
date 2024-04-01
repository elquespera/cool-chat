"use client";
import { GlassPanel } from "../common/glass-panel";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";
import { AssistantControls } from "./assistant-controls";
import { UserControls } from "./user-controls";

export function ChatUser() {
  const { interlocutor, chat } = useChat();

  return interlocutor ? (
    <GlassPanel className="flex h-20 items-center gap-2 shadow-sm">
      <UserInfo
        user={interlocutor}
        chatId={chat?.id}
        showStatus
        size="lg"
        className="ms-12 sm:ms-0"
      />
      <div className="ml-auto flex justify-center gap-3">
        <UserControls />
        <AssistantControls />
      </div>
    </GlassPanel>
  ) : null;
}
