"use client";
import { updateMessage } from "@/db/actions/messages";
import { MessageSelect, MessageStatus } from "@/db/schemas/messages";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";

export function useMessageStatus({ id, chatId, authorId }: MessageSelect) {
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const { refetchMessages } = useMessages();

  const setStatus = async (status: MessageStatus) => {
    if (!interlocutor) return;
    const result = await updateMessage(id, { status });

    if (result.ok) {
      socket?.emit("messageUpdate", {
        messageId: id,
        chatId,
        authorId,
        interlocutorId: interlocutor.id,
        status,
      });
      refetchMessages();
    }
  };

  return setStatus;
}
