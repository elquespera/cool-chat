import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { EmptyRoom } from "@/components/room/empty-room";
import { routes } from "@/constants/routes";
import { findChatByIds } from "@/db/actions/chats";
import { getUserById } from "@/db/actions/users";
import { getAuth } from "@/lib/auth/get-auth";
import { notFound, redirect } from "next/navigation";

type UserPageProps = {
  params: {
    interlocutorId: string;
  };
};

export default async function UserPage({
  params: { interlocutorId },
}: UserPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  const response = await getUserById(interlocutorId);
  if (!response.ok) notFound();

  const chatResponse = await findChatByIds(user.id, response.data.id);
  if (chatResponse.ok) redirect(`${routes.chat}/${chatResponse.data.id}`);

  return (
    <ChatProvider interlocutor={response.data} chat={null}>
      <EmptyRoom />
      <ChatInput />
      <ChatUser />
    </ChatProvider>
  );
}
