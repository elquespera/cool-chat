import { cn } from "@/lib/utils";
import { Hint } from "../common/hint";
import { buttonVariants } from "../ui/button";
import { PaperClipIcon } from "../icons/paper-clip-icon";
import { ChangeEventHandler, useEffect, useState } from "react";
import { AttanchmentPreview } from "./attachment-preview";

type AttachmentButtonProps = {
  // onUrlChange: (url: string) => void;
};

export function AttachmentButton({}: AttachmentButtonProps) {
  const [url, setUrl] = useState("");

  const handleReset = () => {
    URL.revokeObjectURL(url);
    setUrl("");
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUrl(URL.createObjectURL(file));
    } else {
      handleReset();
    }
  };

  return (
    <AttanchmentPreview url={url} onReset={handleReset}>
      <div className="flex items-end self-stretch">
        <Hint value="Attach file" sideOffset={10}>
          <label
            htmlFor="file-upload"
            aria-label="Attach file"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "flex h-8 w-8 cursor-pointer items-center",
            )}
          >
            <PaperClipIcon className="h-5 w-5 shrink-0" />
            <input
              name="attachment"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              id="file-upload"
              className="hidden"
              onChange={handleChange}
              hidden
            />
          </label>
        </Hint>
      </div>
    </AttanchmentPreview>
  );
}
