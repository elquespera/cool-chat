"use client";
import { updateMessage } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";

export function useDeleteMessage(
  { id, chatId, authorId }: MessageWithAuthor,
  ownMessage: boolean,
) {
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const { refetch } = useMessages();

  return async () => {
    if (!ownMessage || !interlocutor) return;
    const result = await updateMessage(id, { status: "deleted" });

    if (result.status === "ok") {
      socket?.emit("messageUpdate", {
        messageId: id,
        chatId,
        authorId,
        interlocutorId: interlocutor.id,
        status: "deleted",
      });
      refetch();
    }
  };
}
