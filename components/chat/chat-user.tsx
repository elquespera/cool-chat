"use client";

import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";

export function ChatUser() {
  const { interlocutor } = useChat();

  return interlocutor ? (
    <div className="absolute flex h-20 w-full gap-2 border-b bg-background/80 p-4 backdrop-blur-sm">
      <UserInfo user={interlocutor} status size="lg" />
    </div>
  ) : null;
}
