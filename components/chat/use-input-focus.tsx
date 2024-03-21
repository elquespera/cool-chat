import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { RefObject } from "react";
import { useChatWindow } from "../providers/chat-window/chat-window-context";

export function useInputFocus(inputRef: RefObject<HTMLTextAreaElement>) {
  const { isMobile } = useChatWindow();

  return useCustomEvent(
    "chatclick",
    () => {
      const input = inputRef.current;
      if (!input) return;

      if (isMobile) {
        input.inputMode = "none";
        input.readOnly = true;
        setTimeout(() => {
          input.focus();
          input.readOnly = false;
          input.inputMode = "text";
        }, 500);
      } else {
        input.focus();
      }
    },
    [isMobile],
  );
}
