import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { MessageProvider } from "@/components/providers/message/message-provider";
import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";

type RoomProps = {
  type: "empty" | "text" | "audio" | "video";
  interlocutor: ContactUser;
  chat: ChatSelect | null;
};

export function Room({ type, interlocutor, chat }: RoomProps) {
  return (
    <ChatProvider interlocutor={interlocutor} chat={chat}>
      {type === "text" ? (
        <MessageProvider>
          <ChatWindow />
          <ChatInput />
        </MessageProvider>
      ) : type === "empty" ? (
        <>
          <div className="flex grow flex-col justify-center">
            <p className="p-4 text-center text-sm font-medium text-muted-foreground">
              Type something and press &apos;Enter&apos; to send your first
              message.
              <br /> Use &apos;Shift+Enter&apos; for a new line.
              <br />
            </p>
          </div>
          <ChatInput />
        </>
      ) : null}
      <ChatUser />
    </ChatProvider>
  );
}
