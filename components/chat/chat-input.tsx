"use client";
import { sendMessage } from "@/db/actions/messages";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { FormEventHandler, useRef, useState } from "react";
import { IconButton } from "../common/icon-button";
import { InputClearButton } from "../common/input-clear-button";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";

export function ChatInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { socket } = useSocket();
  const { interlocutor } = useChat();
  const { refetch: refetchMessages } = useMessages();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!interlocutor || pending) return;

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

  return interlocutor ? (
    <form className="flex gap-2 bg-background p-4" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="min-w-0 grow outline-transparent"
        value={message}
        placeholder="Write a message..."
        onChange={(event) => setMessage(event.target.value)}
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
  ) : null;
}
