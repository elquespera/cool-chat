import { Room } from "@/components/room/room";
import { routes } from "@/constants/routes";
import { getChatById } from "@/db/actions/chats";
import { getUserById } from "@/db/actions/users";
import { getAuth } from "@/lib/auth/get-auth";
import { notFound, redirect } from "next/navigation";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  const chatResponse = await getChatById(chatId);

  if (
    !chatResponse.ok ||
    !(
      chatResponse.data.userOneId === user.id ||
      chatResponse.data.userTwoId === user.id
    )
  ) {
    notFound();
  }

  const interlocutorId =
    chatResponse.data.userOneId === user.id
      ? chatResponse.data.userTwoId
      : chatResponse.data.userOneId;

  const interlocutorResponse = await getUserById(interlocutorId);

  if (!interlocutorResponse.ok) notFound();

  return (
    <Room
      type="text"
      interlocutor={interlocutorResponse.data}
      chat={chatResponse.data}
    />
  );
}
