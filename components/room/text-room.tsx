"use client";

import { ChatInput } from "@/components/chat/chat-input";
import dynamic from "next/dynamic";
import { ChatUser } from "../chat/chat-user";

const ChatWindow = dynamic(() =>
  import("@/components/chat/chat-window").then((module) => ({
    default: module.ChatWindow,
  })),
);

export function TextRoom() {
  return (
    <>
      <ChatWindow />
      <ChatInput />
      <ChatUser />
    </>
  );
}
