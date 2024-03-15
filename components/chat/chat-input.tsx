"use client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { FormEventHandler, useState } from "react";
import { useChat } from "../providers/chat/chat-context";
import { sendMessage } from "@/db/actions/messages";
import { useRouter } from "next/navigation";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { interlocutor } = useChat();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!interlocutor || pending) return;

    setPending(true);
    try {
      const result = await sendMessage(interlocutor.id, message);
      if (result.status === "ok") {
        setMessage("");
      }
    } finally {
      setPending(false);
    }
  };

  return interlocutor ? (
    <form className="flex gap-2 bg-background p-4" onSubmit={handleSubmit}>
      <input
        className="min-w-0 grow outline-transparent"
        value={message}
        placeholder="Write a message..."
        onChange={(event) => setMessage(event.target.value)}
      />
      <IconButton
        toolTip="Send"
        variant="ghost"
        className="h-8 w-8"
        type="submit"
        disabled={!message || pending}
        icon={<PaperPlaneIcon />}
      />
    </form>
  ) : null;
}
