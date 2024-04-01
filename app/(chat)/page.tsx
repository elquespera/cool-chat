import EmptyChat from "@/components/chat/empty-chat";
import { ChatInfoWrapper } from "./_inject-chat-info/chat-info-wrapper";

export default async function ChatPage() {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={null}>
      <EmptyChat />
    </ChatInfoWrapper>
  );
}
