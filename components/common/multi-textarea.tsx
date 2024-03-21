import { cn } from "@/lib/utils";
import {
  ComponentProps,
  ElementRef,
  KeyboardEventHandler,
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { InputClearButton } from "./input-clear-button";

type MultiTextAreaProps = {
  formRef?: RefObject<HTMLFormElement>;
  clearButton?: boolean;
  onValueChange: (value: string) => void;
  maxRows?: number;
} & ComponentProps<"textarea">;

export const MultiTextArea = forwardRef<
  ElementRef<"textarea">,
  MultiTextAreaProps
>(
  (
    {
      value,
      onValueChange,
      clearButton,
      formRef,
      className,
      onKeyDown,
      maxRows = 5,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => inputRef.current,
    );

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      const form = formRef?.current;
      if (form && event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      }
      if (onKeyDown) onKeyDown(event);
    };

    useEffect(() => {
      const input = inputRef?.current;
      if (!input) return;
      input.rows = 1;
      input.rows = Math.max(
        1,
        Math.min(maxRows, Math.round(input.scrollHeight / input.offsetHeight)),
      );
    }, [value]);

    return (
      <>
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          rows={1}
          className={cn(
            "w-0 min-w-0 grow resize-none bg-transparent outline-none outline-transparent",
            className,
          )}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {clearButton && (
          <InputClearButton
            inputRef={inputRef}
            value={value as string}
            onValueChange={onValueChange}
          />
        )}
      </>
    );
  },
);
