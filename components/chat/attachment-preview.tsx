import { PropsWithChildren, useEffect, useState } from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { IconButton } from "../common/icon-button";
import { TrashIcon } from "../icons/trash-icon";
import { SendIcon } from "../icons/send-icon";
import { XMarkIcon } from "../icons/x-mark-icon";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useSettings } from "../providers/settings/settings-context";
import { updateSettings } from "@/db/actions/settings";

type AttanchmentPreviewProps = {
  url: string;
  fileName?: string;
  onReset: () => void;
  onSend: () => void;
} & PropsWithChildren;

export function AttanchmentPreview({
  url,
  fileName,
  children,
  onSend,
  onReset,
}: AttanchmentPreviewProps) {
  const [open, setOpen] = useState(false);
  const { resizeAttachments, setResizeAttachments } = useSettings();

  const handleOpenChange = () => setOpen(!!url);

  const handleResizeAttachmentsChange = async (value: boolean) => {
    const result = await updateSettings({ resizeAttachments: value });
    if (result.ok) {
      setResizeAttachments(result.data.resizeAttachments);
    }
  };

  useEffect(() => setOpen(url !== ""), [url]);

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverAnchor asChild>{children}</PopoverAnchor>
        <PopoverTrigger className="hidden"></PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={16}
          className="flex w-auto max-w-[calc(100vw-2rem)] flex-col items-start gap-2 overflow-hidden"
        >
          {fileName && (
            <span className="max-w-full truncate rounded-sm text-sm font-medium text-muted-foreground">
              {fileName}
            </span>
          )}
          <img
            alt="Preview"
            src={url}
            className="max-h-80 max-w-[min(100vw-5rem,420px)] self-center"
          />
          <div className="mt-2 flex items-center gap-2">
            <Switch
              id="resize"
              checked={resizeAttachments}
              onCheckedChange={handleResizeAttachmentsChange}
            />
            <Label htmlFor="resize">Resize image</Label>
          </div>
          <div className="mt-2 flex gap-2 self-end">
            <IconButton
              className="self-end"
              variant="destructive"
              size="sm"
              icon={<TrashIcon />}
              onClick={onReset}
            >
              Delete
            </IconButton>
            <IconButton
              className="self-end"
              size="sm"
              icon={<SendIcon />}
              onClick={onSend}
            >
              Send
            </IconButton>
          </div>
          <IconButton
            className="absolute right-0 top-0"
            variant="ghost"
            icon={<XMarkIcon />}
            onClick={onReset}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
