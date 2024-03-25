import { Room } from "@/components/room/room";
import { routes } from "@/constants/routes";
import { getChatById } from "@/db/actions/chats";
import { getAuth } from "@/lib/auth/get-auth";
import { notFound, redirect } from "next/navigation";

type ChatPageProps = { params: { chatInfo: string[] } };

export default async function ChatPage({
  params: { chatInfo },
}: ChatPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  let roomType = "text";
  let chatId = chatInfo[0];

  if (chatInfo.length > 1) {
    roomType = chatInfo[0];
    chatId = chatInfo[1];
  }

  const response = await getChatById(chatId);
  if (!response.ok) notFound();

  const chat = response.data;

  if (chat.userOneId !== user.id && chat.userTwoId !== user.id) notFound();

  const interlocutor = chat.userOneId === user.id ? chat.userTwo : chat.userOne;

  return (
    <Room
      type={
        roomType === "video" ? "video" : roomType === "audio" ? "audio" : "text"
      }
      interlocutor={interlocutor}
      chat={chat}
    />
  );
}
