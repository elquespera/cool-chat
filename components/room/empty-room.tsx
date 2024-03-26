import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { CenteredMessage } from "../common/centered-message";

export function EmptyRoom() {
  return (
    <>
      <CenteredMessage>
        Type something and press &apos;Enter&apos; to send your first message.
        <br /> Use &apos;Shift+Enter&apos; for a new line.
        <br />
      </CenteredMessage>
      <ChatInput />
      <ChatUser />
    </>
  );
}
