import { AssistantWelcome } from "@/components/assistant/assistant-welcome";
import { ChatInfoWrapper } from "../_inject-chat-info/chat-info-wrapper";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export default async function AssistantPage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatInfoWrapper user={user} interlocutorId={null} chatId={null}>
      <AssistantWelcome />
    </ChatInfoWrapper>
  );
}
