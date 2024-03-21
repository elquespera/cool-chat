import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import {
  CheckCircledIcon,
  CopyIcon,
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ComponentProps, useState } from "react";
import { useCopyMessage } from "./use-copy-message";
import { useDeleteMessage } from "./use-delete-message";
import ConfirmDialog from "../common/confirm-dialog";
import { useMessages } from "../providers/message/message-context";

type MessageMenuProps = {
  message: MessageWithAuthor;
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
          className={cn(
            "absolute right-0 top-0 flex h-7 w-7 items-center justify-center outline-none",
            "opacity-20 transition-opacity group-hover:opacity-100 group-focus:opacity-100",
            className,
          )}
          {...props}
        >
          <DotsVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ownMessage && (
          <>
            <DropdownMenuItem onClick={() => setEditingId(message.id)}>
              <Pencil1Icon className="mr-1 h-4 w-4" />
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
            <CheckCircledIcon className="mr-1 h-4 w-4" />
          ) : (
            <CopyIcon className="mr-1 h-4 w-4" />
          )}
          Copy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
