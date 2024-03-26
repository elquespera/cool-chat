import { OpenChat } from "@/db/schemas/chats";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { useAuth } from "../auth/auth-context";
import { useSocket } from "../socket/socket-context";
import { updateMessage } from "@/db/actions/messages";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";

export function useChatEvents(
  openChats: OpenChat[] | undefined,
  refetchOpenChats: () => Promise<OpenChat[] | undefined | void>,
) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const playMessageAlert = useSoundEffect("message-alert");

  // Refetch on user status change
  useCustomEvent(
    "userstatuschange",
    ({ userId }) => {
      if (openChats?.some(({ interlocutor }) => interlocutor.id === userId)) {
        refetchOpenChats();
      }
    },
    [openChats, refetchOpenChats],
  );

  // Mark messages delivered
  useCustomEvent(
    "messageupdate",
    async ({ interlocutorId, status, messageId, ...rest }) => {
      if (interlocutorId === user?.id && status === "created") {
        playMessageAlert();
        const result = await updateMessage(messageId, { status: "delivered" });

        if (result.ok) {
          socket?.emit("messageUpdate", {
            messageId,
            interlocutorId,
            status: "delivered",
            ...rest,
          });
        }

        refetchOpenChats();
      }
    },
    [user, socket, refetchOpenChats],
  );
}
