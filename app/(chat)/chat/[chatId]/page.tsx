import { TextRoom } from "@/components/room/text-room";
import { ChatInfoWrapper } from "../../_inject-chat-info/chat-info-wrapper";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export default async function TextChatPage({
  params: { chatId },
}: ChatPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatInfoWrapper user={user} interlocutorId={null} chatId={chatId}>
      <TextRoom />
    </ChatInfoWrapper>
  );
}

export const dynamic = "force-dynamic";
