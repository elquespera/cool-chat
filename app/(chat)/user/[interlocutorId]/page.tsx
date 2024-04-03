import { EmptyRoom } from "@/components/room/empty-room";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";
import { ChatInfoWrapper } from "../../_inject-chat-info/chat-info-wrapper";

type UserPageProps = {
  params: { interlocutorId: string };
};

export default async function UserPage({
  params: { interlocutorId },
}: UserPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatInfoWrapper user={user} interlocutorId={interlocutorId} chatId={null}>
      <EmptyRoom />
    </ChatInfoWrapper>
  );
}
