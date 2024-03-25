import { ChatUser } from "@/components/chat/chat-user";
import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect } from "@/db/schemas/chats";
import { EmptyRoom } from "./empty-room";
import { MediaRoom } from "./media-room";
import { TextRoom } from "./text-room";

type RoomProps = {
  type: "empty" | "text" | "audio" | "video";
  interlocutor: ContactUser;
  chat: ChatSelect | null;
};

export function Room({ type, interlocutor, chat }: RoomProps) {
  return (
    <ChatProvider interlocutor={interlocutor} chat={chat}>
      {type === "text" ? (
        <>
          <TextRoom />
          <ChatUser />
        </>
      ) : type === "empty" ? (
        <>
          <EmptyRoom />
          <ChatUser />
        </>
      ) : (
        <MediaRoom type={type} />
      )}
    </ChatProvider>
  );
}
