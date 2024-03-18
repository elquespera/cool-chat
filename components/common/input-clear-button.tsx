import { ComponentProps, RefObject } from "react";
import { IconButton } from "./icon-button";
import { Cross1Icon } from "@radix-ui/react-icons";

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
      type="button"
      className="h-7 w-7 shrink-0"
      icon={<Cross1Icon />}
      variant="ghost"
      onClick={handleClick}
    />
  ) : null;
}
