import { ComponentProps, RefObject } from "react";
import { IconButton } from "./icon-button";
import { XMarkIcon } from "../icons/x-mark-icon";

type InputClearButtonProps = {
  inputRef: RefObject<HTMLElement>;
  value: string;
  onValueChange: (value: string) => void;
} & ComponentProps<typeof IconButton>;

export function InputClearButton({
  inputRef,
  value,
  onValueChange,
  ...props
}: InputClearButtonProps) {
  const handleClick = () => {
    onValueChange("");
    inputRef.current?.focus();
  };

  return value ? (
    <IconButton
      {...props}
      toolTip="Clear"
      aria-label="Clear"
      type="button"
      className="h-8 w-8 shrink-0"
      icon={<XMarkIcon className="h-5 w-5" />}
      variant="ghost"
      onClick={handleClick}
    />
  ) : null;
}
