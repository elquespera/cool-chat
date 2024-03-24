import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSelect } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import ConfirmDialog from "../common/confirm-dialog";
import { useMessages } from "../providers/message/message-context";
import { useCopyMessage } from "./use-copy-message";
import { useDeleteMessage } from "./use-delete-message";
import { PencilIcon } from "../icons/pencil-icon";
import { TrashIcon } from "../icons/trash-icon";
import { ClipboardIcon } from "../icons/clipboard-icon";
import { CheckCircleIcon } from "../icons/check-circle-icon";
import { EllipsisVerticalIcon } from "../icons/ellipsis-vertical-icon";

type MessageMenuProps = {
  message: MessageSelect;
  ownMessage: boolean;
} & ComponentProps<"button">;

export function MessageMenu({
  message,
  ownMessage,
  className,
  ...props
}: MessageMenuProps) {
  const [open, setOpen] = useState(false);
  const { setEditingId } = useMessages();
  const handleDelete = useDeleteMessage(message, ownMessage);
  const { handleCopy, copySuccess } = useCopyMessage(message);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          tabIndex={-1}
          aria-label="Message menu"
          className={cn(
            "absolute right-0 top-0 flex h-7 w-7 items-center justify-center outline-none transition-opacity",
            "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
            className,
          )}
          {...props}
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ownMessage && (
          <>
            <DropdownMenuItem onClick={() => setEditingId(message.id)}>
              <PencilIcon className="mr-1 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <ConfirmDialog
              onSuccess={async () => {
                await handleDelete();
                setOpen(false);
              }}
            >
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon className="mr-1 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </ConfirmDialog>

            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleCopy}>
          {copySuccess ? (
            <CheckCircleIcon className="mr-1 h-4 w-4" />
          ) : (
            <ClipboardIcon className="mr-1 h-4 w-4" />
          )}
          Copy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
