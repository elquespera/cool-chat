import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { MessageProvider } from "@/components/providers/message/message-provider";
import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { EmptyRoom } from "./empty-room";
import { TextRoom } from "./text-room";
import { MediaRoom } from "./media-room";

type RoomProps = {
  type: "empty" | "text" | "audio" | "video";
  interlocutor: ContactUser;
  chat: ChatSelect | null;
};

export function Room({ type, interlocutor, chat }: RoomProps) {
  return (
    <ChatProvider interlocutor={interlocutor} chat={chat}>
      {type === "text" ? (
        <TextRoom />
      ) : type === "empty" ? (
        <EmptyRoom />
      ) : (
        <MediaRoom type={type} />
      )}
      <ChatUser />
    </ChatProvider>
  );
}
