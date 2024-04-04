import { OpenChat } from "@/db/schemas/chats";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { useAuth } from "../auth/auth-context";
import { useSocket } from "../socket/socket-context";
import { updateMessage } from "@/db/actions/messages";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";
import { useEffect, useRef } from "react";

export type TypingContactList = Record<string, number>;

const typingDelay = 3000;

export function useChatEvents(
  openChats: OpenChat[] | undefined,
  refetchOpenChats: () => Promise<void>,
  typingContacts: TypingContactList,
  setTypingContacts: (value: TypingContactList) => void,
) {
  const { user } = useAuth();
  const { updateMessageStatus } = useSocket();
  const playMessageAlert = useSoundEffect("message-alert");

  // Refetch on user status change
  useCustomEvent(
    "userstatuschange",
    ({ userId, status, interlocutorId }) => {
      if (
        interlocutorId === user?.id &&
        openChats?.some(({ interlocutor }) => interlocutor.id === userId)
      ) {
        if (status === "typing") {
          const newTypingList = { ...typingContacts };
          newTypingList[userId] = Date.now();
          setTypingContacts(newTypingList);
        } else {
          refetchOpenChats();
        }
      }
    },
    [openChats, refetchOpenChats],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTypingList = { ...typingContacts };
      const now = Date.now();
      Object.entries(newTypingList).forEach(([userId, timestamp]) => {
        if (now - timestamp > typingDelay) {
          delete newTypingList[userId];
        }
      });

      setTypingContacts(newTypingList);
    }, 1000);

    return () => clearTimeout(timer);
  }, [typingContacts, setTypingContacts]);

  // Mark messages delivered
  useCustomEvent(
    "messageupdate",
    async ({ interlocutorId, status, messageId, ...rest }) => {
      if (interlocutorId === user?.id && status === "created") {
        playMessageAlert();
        const result = await updateMessage(messageId, { status: "delivered" });

        if (result.ok) {
          updateMessageStatus({
            messageId,
            interlocutorId,
            status: "delivered",
            ...rest,
          });
        }

        refetchOpenChats();
      }
    },
    [user, updateMessageStatus, refetchOpenChats],
  );
}
