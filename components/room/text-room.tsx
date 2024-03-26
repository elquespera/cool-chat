"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageProvider } from "@/components/providers/message/message-provider";
import { ChatUser } from "../chat/chat-user";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() =>
  import("@/components/chat/chat-window").then((module) => ({
    default: module.ChatWindow,
  })),
);

export function TextRoom() {
  return (
    <MessageProvider>
      <ChatWindow />
      <ChatInput />
      <ChatUser />
    </MessageProvider>
  );
}
