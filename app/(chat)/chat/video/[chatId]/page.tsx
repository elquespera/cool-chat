import { ChatInfoWrapper } from "@/app/(chat)/_inject-chat-info/chat-info-wrapper";
import { MediaRoom } from "@/components/room/media-room";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export default async function VideoChatPage({
  params: { chatId },
}: ChatPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);
  return (
    <ChatInfoWrapper user={user} interlocutorId={null} chatId={chatId}>
      <MediaRoom type="video" />
    </ChatInfoWrapper>
  );
}
