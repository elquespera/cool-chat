import { MessageWithAuthor } from "@/db/schemas/messages";
import { MultiTextArea } from "../common/multi-textarea";
import { FormEventHandler, useRef, useState } from "react";
import { IconButton } from "../common/icon-button";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";
import { useChat } from "../providers/chat/chat-context";
import { updateMessage } from "@/db/actions/messages";

type MessageEditFormProps = {
  message: MessageWithAuthor;
};

export function MessageEditForm({
  message: { content, id },
}: MessageEditFormProps) {
  const [value, setValue] = useState(content);
  const [pending, setPending] = useState(false);
  const { setEditingId, refetch } = useMessages();
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const formRef = useRef<HTMLFormElement>(null);

  const isValid = interlocutor && !pending && value && value !== content;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    setPending(true);
    try {
      const result = await updateMessage(id, {
        content: value,
        updatedAt: new Date(),
      });

      if (result.status === "ok") {
        socket?.emit("messageUpdate", {
          chatId: result.data.chatId,
          messageId: result.data.id,
          authorId: result.data.authorId,
          interlocutorId: interlocutor.id,
          status: "updated",
        });

        await refetch();
        setEditingId(undefined);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <form ref={formRef} className="grow" onSubmit={handleSubmit}>
      <div className="flex grow">
        <MultiTextArea
          value={value}
          onValueChange={setValue}
          className="grow"
          formRef={formRef}
          autoFocus
          autoSelectAll
        />
      </div>
      <div className="mt-2 flex flex-wrap justify-end gap-2">
        <IconButton
          type="submit"
          size="sm"
          className="h-7"
          pending={pending}
          disabled={!isValid}
        >
          OK
        </IconButton>
        <IconButton
          type="button"
          size="sm"
          variant="secondary"
          className="h-7"
          onClick={() => setEditingId(undefined)}
        >
          Cancel
        </IconButton>
      </div>
    </form>
  );
}
