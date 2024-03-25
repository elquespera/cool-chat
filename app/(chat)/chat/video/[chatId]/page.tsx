import { RoomWrapper } from "@/app/(chat)/room-wrapper";
import { MediaRoom } from "@/components/room/media-room";

export default async function VideoChatPage({
  params: { chatId },
}: ChatPageProps) {
  return (
    <RoomWrapper chatId={chatId}>
      <MediaRoom type="video" />
    </RoomWrapper>
  );
}
