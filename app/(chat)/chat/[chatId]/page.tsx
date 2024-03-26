import { TextRoom } from "@/components/room/text-room";
import { ChatInfoWrapper } from "../../_inject-chat-info/chat-info-wrapper";

export default async function TextChatPage({
  params: { chatId },
}: ChatPageProps) {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={chatId}>
      <TextRoom />
    </ChatInfoWrapper>
  );
}
