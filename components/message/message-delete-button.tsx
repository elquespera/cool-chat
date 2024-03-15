import { ComponentProps } from "react";
import { IconButton } from "../common/icon-button";
import { TrashIcon } from "@radix-ui/react-icons";
import { markMessageDeleted } from "@/db/actions/messages";
import { useSocket } from "../providers/socket/socket-context";
import { useMessages } from "../providers/message/message-context";

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
  const { refetch } = useMessages();

  const handleClick = async () => {
    const result = await markMessageDeleted(messageId);
    if (result.status === "ok") {
      socket?.emit("messageModified", chatId, authorId);
      refetch();
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
