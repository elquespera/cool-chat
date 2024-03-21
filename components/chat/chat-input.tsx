"use client";
import { sendMessage } from "@/db/actions/messages";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { IconButton } from "../common/icon-button";
import { InputClearButton } from "../common/input-clear-button";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";
import { EmojiPicker } from "./emoji-picker";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { useAuth } from "../providers/auth/auth-context";
import { MultiTextArea } from "../common/multi-textarea";
import { useInsertEmoji } from "./use-insert-emoji";

const maxInputRows = 5;

export function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { interlocutor, chat, refetchChat } = useChat();
  const { refetch: refetchMessages } = useMessages();

  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!interlocutor || !user || pending || !message) return;

    setPending(true);
    try {
      const result = await sendMessage(interlocutor.id, message);
      if (result.status === "ok") {
        setMessage("");

        socket?.emit("messageUpdate", {
          chatId: result.data.chatId,
          messageId: result.data.id,
          authorId: user.id,
          interlocutorId: interlocutor.id,
          status: "created",
        });

        if (chat?.id !== result.data.chatId) {
          refetchChat(interlocutor);
        } else {
          await refetchMessages("smooth");
        }
      }
    } finally {
      setPending(false);
    }
  };

  const handleInsertEmoji = useInsertEmoji(inputRef, message, setMessage);

  useCustomEvent("chatclick", () => inputRef.current?.focus());

  return interlocutor ? (
    <div className="border-t bg-background px-2 py-3">
      <form
        ref={formRef}
        className="flex gap-1 rounded-3xl bg-muted px-2 py-1.5"
        onSubmit={handleSubmit}
      >
        <MultiTextArea
          ref={inputRef}
          formRef={formRef}
          value={message}
          onValueChange={setMessage}
          className="pl-1 pt-1"
          placeholder="Write a message..."
          clearButton
          autoFocus
        />

        <EmojiPicker onEmojiChange={handleInsertEmoji} />
        <IconButton
          toolTip="Send"
          variant="ghost"
          className="h-8 w-8"
          type="submit"
          disabled={!message || pending}
          icon={<PaperPlaneIcon />}
        />
      </form>
    </div>
  ) : null;
}
