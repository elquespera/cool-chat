import { EmptyRoom } from "@/components/room/empty-room";
import { ChatInfoWrapper } from "./_inject-chat-info/chat-info-wrapper";

export default async function ChatPage() {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={null}>
      <EmptyRoom />
    </ChatInfoWrapper>
  );
}
