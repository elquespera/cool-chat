import { TextRoom } from "@/components/room/text-room";
import { RoomWrapper } from "../../room-wrapper";

export default async function TextChatPage({
  params: { chatId },
}: ChatPageProps) {
  return (
    <RoomWrapper chatId={chatId}>
      <TextRoom />
    </RoomWrapper>
  );
}
