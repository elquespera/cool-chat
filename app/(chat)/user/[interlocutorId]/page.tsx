import { EmptyRoom } from "@/components/room/empty-room";
import { ChatInfoWrapper } from "../../_inject-chat-info/chat-info-wrapper";

type UserPageProps = {
  params: { interlocutorId: string };
};

export default async function UserPage({
  params: { interlocutorId },
}: UserPageProps) {
  return (
    <ChatInfoWrapper interlocutorId={interlocutorId} chatId={null}>
      <EmptyRoom />
    </ChatInfoWrapper>
  );
}
