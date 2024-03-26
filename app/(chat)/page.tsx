import { CenteredMessage } from "@/components/common/centered-message";
import { ChatInfoWrapper } from "./_inject-chat-info/chat-info-wrapper";

export default async function ChatPage() {
  return (
    <ChatInfoWrapper interlocutorId={null} chatId={null}>
      <CenteredMessage>
        Please select from one of your contacts to start chatting.
        <br />
        Use search to looks for new contacts.
      </CenteredMessage>
    </ChatInfoWrapper>
  );
}
