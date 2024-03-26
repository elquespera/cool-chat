import { CenteredMessage } from "@/components/common/centered-message";
import { ChatInfoWrapper } from "../../_inject-chat-info/chat-info-wrapper";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";

type UserPageProps = {
  params: {
    interlocutorId: string;
  };
};

export default async function UserPage({
  params: { interlocutorId },
}: UserPageProps) {
  return (
    <ChatInfoWrapper interlocutorId={interlocutorId} chatId={null}>
      <CenteredMessage>Not in Contacts</CenteredMessage>
      <ChatInput />
      <ChatUser />
    </ChatInfoWrapper>
  );
}
