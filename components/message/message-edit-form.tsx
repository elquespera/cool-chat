import { updateMessage } from "@/db/actions/messages";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { usePendingFormState } from "@/lib/hooks/use-pending-state";
import { useRef, useState } from "react";
import { IconButton } from "../common/icon-button";
import { MultiTextArea } from "../common/multi-textarea";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";

type MessageEditFormProps = {
  message: MessageWithAuthor;
};

export function MessageEditForm({
  message: { content, id },
}: MessageEditFormProps) {
  const [value, setValue] = useState(content);
  const { setEditingId, refetchMessages } = useMessages();
  const { updateMessageStatus } = useSocket();
  const { interlocutor } = useChat();
  const formRef = useRef<HTMLFormElement>(null);

  const isValid = interlocutor && value && value !== content;

  const { trigger: handleSubmit, isPending } = usePendingFormState(async () => {
    if (!isValid) return;

    const result = await updateMessage(id, {
      content: value,
      updatedAt: new Date(),
    });

    if (result.ok) {
      updateMessageStatus({
        chatId: result.data.chatId,
        messageId: result.data.id,
        authorId: result.data.authorId,
        interlocutorId: interlocutor.id,
        status: "updated",
      });

      await refetchMessages();
      setEditingId(undefined);
    }
  });

  const handleCancel = () => setEditingId(undefined);

  return (
    <form
      ref={formRef}
      className="flex w-full flex-col"
      onSubmit={handleSubmit}
    >
      <MultiTextArea
        value={value}
        onValueChange={setValue}
        className="w-full text-sm @lg:text-base"
        formRef={formRef}
        autoFocus
        autoSelectAll
        onEscape={handleCancel}
      />
      <div className="mt-2 flex flex-wrap justify-end gap-2">
        <IconButton
          type="submit"
          size="sm"
          className="h-7"
          pending={isPending}
          disabled={!isValid || isPending}
        >
          OK
        </IconButton>
        <IconButton
          type="button"
          size="sm"
          variant="secondary"
          className="h-7"
          onClick={handleCancel}
        >
          Cancel
        </IconButton>
      </div>
    </form>
  );
}
