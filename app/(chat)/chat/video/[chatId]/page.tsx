import { ChatInfoWrapper } from "@/app/(chat)/_inject-chat-info/chat-info-wrapper";
import { MediaRoom } from "@/components/room/media-room";

export default async function VideoChatPage({
  params: { chatId },
}: ChatPageProps) {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={chatId}>
      <MediaRoom type="video" />
    </ChatInfoWrapper>
  );
}
