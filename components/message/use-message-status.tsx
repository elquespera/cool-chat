"use client";
import { markMessageDeleted, updateMessage } from "@/db/actions/messages";
import { MessageSelect, MessageStatus } from "@/db/schemas/messages";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";

export function useMessageStatus({ id, chatId, authorId }: MessageSelect) {
  const { updateMessageStatus } = useSocket();
  const { interlocutor, refetchOpenChats } = useChat();
  const { refetchMessages } = useMessages();

  const setStatus = async (status: MessageStatus) => {
    if (!interlocutor) return;

    const result =
      status === "deleted"
        ? await markMessageDeleted(id)
        : await updateMessage(id, { status });

    if (result.ok) {
      updateMessageStatus({
        messageId: id,
        chatId,
        authorId,
        interlocutorId: interlocutor.id,
        status,
      });
      refetchMessages();
      refetchOpenChats();
    }
  };

  return setStatus;
}
