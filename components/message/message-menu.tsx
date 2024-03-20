import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ComponentProps } from "react";

type MessageMenuProps = {
  ownMessage: boolean;
  onDelete: () => void;
} & ComponentProps<"button">;

export function MessageMenu({
  ownMessage,
  onDelete,
  className,
  ...props
}: MessageMenuProps) {
  return (
    <DropdownMenu>
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
            <DropdownMenuItem>
              <Pencil1Icon className="mr-1 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <TrashIcon className="mr-1 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>Copy</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
