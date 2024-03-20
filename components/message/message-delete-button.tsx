import { ComponentProps } from "react";
import { IconButton } from "../common/icon-button";
import { TrashIcon } from "@radix-ui/react-icons";
import { updateMessage } from "@/db/actions/messages";
import { useSocket } from "../providers/socket/socket-context";
import { useMessages } from "../providers/message/message-context";
import { useChat } from "../providers/chat/chat-context";

type MessageDeleteButtonProps = {
  messageId: string;
  chatId: string;
  authorId: string;
} & ComponentProps<typeof IconButton>;

export function MessageDeleteButton({
  messageId,
  chatId,
  authorId,
}: MessageDeleteButtonProps) {
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const { refetch } = useMessages();

  const handleClick = async () => {
    if (!interlocutor) return;
    const result = await updateMessage(messageId, { status: "deleted" });

    if (result.status === "ok") {
      socket?.emit("messageUpdate", {
        messageId,
        chatId,
        authorId,
        interlocutorId: interlocutor.id,
        status: "deleted",
      });
      refetch("none");
    }
  };

  return (
    <IconButton
      className="h-6 w-6 opacity-0 group-hover:opacity-100"
      toolTip="Delete"
      variant="ghost"
      icon={<TrashIcon />}
      onClick={handleClick}
    />
  );
}
