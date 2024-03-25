import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { routes } from "@/constants/routes";
import { getChatById } from "@/db/actions/chats";
import { getAuth } from "@/lib/auth/get-auth";
import { notFound, redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type RoomWrapperProps = {
  chatId: string;
} & PropsWithChildren;

export async function RoomWrapper({ chatId, children }: RoomWrapperProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  const response = await getChatById(chatId);
  if (!response.ok) notFound();

  const chat = response.data;

  if (chat.userOneId !== user.id && chat.userTwoId !== user.id) notFound();

  const interlocutor = chat.userOneId === user.id ? chat.userTwo : chat.userOne;

  return (
    <ChatProvider interlocutor={interlocutor} chat={chat}>
      {children}
    </ChatProvider>
  );
}
