import { NotFound } from "@/components/common/not-found";
import { routes } from "@/constants/routes";
import { findChatByIds, getChatById } from "@/db/actions/chats";
import { getUserById } from "@/db/actions/users";
import { ContactUser } from "@/db/schemas/auth";
import { ChatWithUsers } from "@/db/schemas/chats";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { InjectChatInfo } from "./inject-chat-info";

type ChatInfoWrapperProps = {
  interlocutorId: string | null;
  chatId: string | null;
} & PropsWithChildren;

export async function ChatInfoWrapper({
  children,
  interlocutorId,
  chatId,
}: ChatInfoWrapperProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  let interlocutor: ContactUser | null = null;
  let chat: ChatWithUsers | null = null;
  let body = children;

  if (interlocutorId) {
    const response = await getUserById(interlocutorId);
    if (response.ok) {
      interlocutor = response.data;
      const chatResponse = await findChatByIds(user.id, response.data.id);
      if (chatResponse.ok) redirect(`${routes.chat}/${chatResponse.data.id}`);
    } else {
      body = UserNotFound;
    }
  }

  if (chatId) {
    const response = await getChatById(chatId);
    if (response.ok) {
      chat = response.data;

      if (chat.userOneId === user.id || chat.userTwoId === user.id) {
        interlocutor = chat.userOneId === user.id ? chat.userTwo : chat.userOne;
      } else {
        body = ChatNotFound;
      }
    } else {
      body = ChatNotFound;
    }
  }

  return (
    <>
      <InjectChatInfo chat={chat} interlocutor={interlocutor} />
      {body}
    </>
  );
}

const UserNotFound = (
  <NotFound title="User Not Found">{`The user you're looking for was not found on the server.`}</NotFound>
);

const ChatNotFound = (
  <NotFound title="Chat Not Found">{`The chat you're looking for was not found on the server.`}</NotFound>
);
