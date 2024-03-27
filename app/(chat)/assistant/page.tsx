import { AssistantWelcome } from "@/components/assistant/assistant-welcome";
import { ChatInfoWrapper } from "../_inject-chat-info/chat-info-wrapper";

export default async function AssistantPage({}) {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={null}>
      <AssistantWelcome />
    </ChatInfoWrapper>
  );
}
