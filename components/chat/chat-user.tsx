"use client";

import { useChat } from "../providers/chat/chat-context";

export function ChatUser() {
  const { interlocutor } = useChat();

  return interlocutor ? (
    <div className="absolute flex h-20 w-full gap-2 border-b bg-background/80 p-4 backdrop-blur-sm"></div>
  ) : null;
}
