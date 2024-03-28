import { PropsWithChildren, useEffect, useState } from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { IconButton } from "../common/icon-button";
import { TrashIcon } from "../icons/trash-icon";

type AttanchmentPreviewProps = {
  url: string;
  onReset: () => void;
} & PropsWithChildren;

export function AttanchmentPreview({
  url,
  children,
  onReset,
}: AttanchmentPreviewProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(url !== ""), [url]);

  const handleOpenChange = () => setOpen(!!url);

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverAnchor asChild>{children}</PopoverAnchor>
        <PopoverTrigger className="hidden"></PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={16}
          className="flex w-auto flex-col items-start gap-4"
        >
          <img
            alt="Preview"
            src={url}
            className="max-h-80 max-w-[min(100vw-5rem,420px)]"
          />
          <IconButton
            variant="destructive"
            size="sm"
            icon={<TrashIcon />}
            onClick={onReset}
          >
            Delete
          </IconButton>
        </PopoverContent>
      </Popover>
    </>
  );
}
