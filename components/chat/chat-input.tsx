"use client";
import { sendMessage } from "@/db/actions/messages";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconButton } from "../common/icon-button";
import { InputClearButton } from "../common/input-clear-button";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";
import { EmojiPicker } from "./emoji-picker";

const maxInputRows = 5;

export function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const { refetch: refetchMessages } = useMessages();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!interlocutor || pending || !message) return;

    setPending(true);
    try {
      const result = await sendMessage(interlocutor.id, message);
      if (result.status === "ok") {
        setMessage("");
        socket?.emit("messageModified", result.data.chatId, result.data.id);
        await refetchMessages("smooth");
      }
    } finally {
      setPending(false);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
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

  useEffect(() => {
    const input = inputRef?.current;
    if (!input) return;
    input.rows = 1;
    input.rows = Math.max(
      1,
      Math.min(
        maxInputRows,
        Math.round(input.scrollHeight / input.offsetHeight),
      ),
    );
  }, [message]);

  return interlocutor ? (
    <div className="gap-2 border-t bg-background px-2 py-3">
      <form
        ref={formRef}
        className="flex rounded-3xl bg-muted px-2 py-1.5"
        onSubmit={handleSubmit}
      >
        <EmojiPicker onEmojiChange={handleInsertEmoji} />
        <textarea
          ref={inputRef}
          rows={1}
          className="min-w-0 grow resize-none bg-transparent pt-0.5 outline-none outline-transparent"
          value={message}
          placeholder="Write a message..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              formRef.current?.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true }),
              );
            }
          }}
          autoFocus
        />
        <InputClearButton
          inputRef={inputRef}
          value={message}
          onValueChange={setMessage}
        />
        <IconButton
          toolTip="Send"
          variant="ghost"
          className="h-7 w-7"
          type="submit"
          disabled={!message || pending}
          icon={<PaperPlaneIcon />}
        />
      </form>
    </div>
  ) : null;
}
