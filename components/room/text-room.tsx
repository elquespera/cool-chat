import { ChatInput } from "@/components/chat/chat-input";
import { ChatWindow } from "@/components/chat/chat-window";
import { MessageProvider } from "@/components/providers/message/message-provider";
import { ChatUser } from "../chat/chat-user";

export function TextRoom() {
  return (
    <MessageProvider>
      <ChatWindow />
      <ChatInput />
      <ChatUser />
    </MessageProvider>
  );
}