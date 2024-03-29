import { cn } from "@/lib/utils";
import { Hint } from "../common/hint";
import { buttonVariants } from "../ui/button";
import { PaperClipIcon } from "../icons/paper-clip-icon";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AttanchmentPreview } from "./attachment-preview";

type AttachmentButtonProps = {
  file?: File;
  onFileChange: (file?: File) => void;
};

export function AttachmentButton({
  file,
  onFileChange,
}: AttachmentButtonProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    URL.revokeObjectURL(url);
    setUrl("");
  }, [inputRef, url]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    onFileChange(file);
  };

  useEffect(() => {
    if (file) {
      setUrl(URL.createObjectURL(file));
    } else {
      handleReset();
    }
  }, [file, handleReset]);

  return (
    <AttanchmentPreview url={url} fileName={file?.name} onReset={handleReset}>
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
              ref={inputRef}
              name="attachment"
              type="file"
              accept="image/*"
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
