import { RefObject } from "react";

export function useInsertEmoji(
  inputRef: RefObject<HTMLTextAreaElement>,
  message: string,
  setMessage: (message: string) => void,
) {
  return (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const setSelection = (at: number) =>
      setTimeout(() => input.setSelectionRange(at, at), 20);

    if (input.selectionEnd === 0) {
      setMessage(`${emoji} ${message}`);
    } else if (input.selectionStart === message.length) {
      setMessage(`${message} ${emoji}`);
    } else {
      setMessage(
        `${message.slice(0, input.selectionStart)} ${emoji} ${message.slice(input.selectionEnd)}`,
      );
    }
    setSelection(input.selectionStart + emoji.length + 1);
    input.focus();
  };
}
