import { ChatInput } from "./chat-input";
import { ChatUser } from "./chat-user";
import { ChatWindow } from "./chat-window";

export function ChatPanel() {
  return (
    <div className="relative flex grow flex-col">
      <ChatWindow />
      <ChatInput />
      <ChatUser />
    </div>
  );
}
