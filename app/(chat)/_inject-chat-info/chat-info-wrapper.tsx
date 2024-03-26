import { routes } from "@/constants/routes";
import { findChatByIds, getChatById } from "@/db/actions/chats";
import { getUserById } from "@/db/actions/users";
import { ContactUser } from "@/db/schemas/auth";
import { ChatWithUsers } from "@/db/schemas/chats";
import { getAuth } from "@/lib/auth/get-auth";
import { notFound, redirect } from "next/navigation";
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

  if (interlocutorId) {
    const response = await getUserById(interlocutorId);
    if (!response.ok) notFound();

    interlocutor = response.data;
    const chatResponse = await findChatByIds(user.id, response.data.id);
    if (chatResponse.ok) redirect(`${routes.chat}/${chatResponse.data.id}`);
  }

  if (chatId) {
    const response = await getChatById(chatId);
    if (!response.ok) notFound();
    chat = response.data;

    if (chat.userOneId !== user.id && chat.userTwoId !== user.id) notFound();

    interlocutor = chat.userOneId === user.id ? chat.userTwo : chat.userOne;
  }

  return (
    <>
      <InjectChatInfo chat={chat} interlocutor={interlocutor} />
      {children}
    </>
  );
}
