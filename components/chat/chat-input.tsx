"use client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { IconButton } from "../common/icon-button";
import { FormEventHandler, useState } from "react";

export function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(message);
  };

  return (
    <form className="flex gap-2 bg-background p-4" onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a message..."
        className="min-w-0 grow outline-transparent"
      />
      <IconButton
        toolTip="Send"
        variant="ghost"
        className="h-8 w-8"
        type="submit"
        disabled={!message}
        icon={<PaperPlaneIcon />}
      />
    </form>
  );
}
