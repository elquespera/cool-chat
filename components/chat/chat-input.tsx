"use client";
import { routes } from "@/constants/routes";
import { sendMessage } from "@/db/actions/messages";
import { useRouter } from "next/navigation";
import { FormEventHandler, useRef, useState } from "react";
import { GlassPanel } from "../common/glass-panel";
import { IconButton } from "../common/icon-button";
import { InputWrapper } from "../common/input-wrapper";
import { MultiTextArea } from "../common/multi-textarea";
import { SendIcon } from "../icons/send-icon";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";
import { EmojiPicker } from "./emoji-picker";
import { useInsertEmoji } from "./use-insert-emoji";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";

export function ChatInput() {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { interlocutor, chat, refetchOpenChats } = useChat();
  const { isStreaming, generateResponse } = useAssistant();
  const { refetchMessages } = useMessages();
  const playSound = useSoundEffect("blip");

  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const isValid = interlocutor && user && message && !pending && !isStreaming;
  const handleInsertEmoji = useInsertEmoji(inputRef, message, setMessage);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    setPending(true);
    try {
      const result = await sendMessage(interlocutor.id, message);
      if (result.ok) {
        setMessage("");
        playSound();

        socket?.emit("messageUpdate", {
          messageId: result.data.id,
          chatId: result.data.chatId,
          authorId: result.data.authorId,
          interlocutorId: interlocutor.id,
          status: "created",
        });

        if (chat?.id !== result.data.chatId) {
          router.push(`${routes.chat}/${result.data.chatId}`);
        } else {
          refetchMessages("smooth");
        }
        refetchOpenChats();

        generateResponse(result.data.chatId);
      }
    } finally {
      setPending(false);
    }
  };

  return interlocutor ? (
    <GlassPanel position="bottom" className="shadow-top">
      <form ref={formRef} onSubmit={handleSubmit}>
        <InputWrapper>
          <MultiTextArea
            ref={inputRef}
            formRef={formRef}
            value={message}
            onValueChange={setMessage}
            className="ps-1"
            placeholder="Write a message..."
            clearButton
          />

          <EmojiPicker onEmojiChange={handleInsertEmoji} />
          <IconButton
            toolTip="Send"
            aria-label="Send"
            variant="ghost"
            className="h-8 w-8 group-focus-within:text-primary dark:group-focus-within:text-foreground"
            type="submit"
            disabled={!isValid}
            icon={<SendIcon className="h-5 w-5" />}
          />
        </InputWrapper>
      </form>
    </GlassPanel>
  ) : null;
}
