import EmptyChat from "@/components/chat/empty-chat";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { ChatInfoWrapper } from "./_inject-chat-info/chat-info-wrapper";

export default async function ChatPage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatInfoWrapper user={user} interlocutorId={null} chatId={null}>
      <EmptyChat />
    </ChatInfoWrapper>
  );
}
