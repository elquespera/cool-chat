"use client";
import { sendMessage } from "@/db/actions/messages";
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
import { useInputFocus } from "./use-input-focus";
import { useInsertEmoji } from "./use-insert-emoji";
import { useOpenChats } from "../providers/open-chats/open-chats-context";

export function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { interlocutor, chat } = useChat();
  const { isStreaming, generateResponse } = useAssistant();
  const { refetchMessages } = useMessages();
  const { refetchOpenChats } = useOpenChats();

  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const isValid = interlocutor && user && message && !pending && !isStreaming;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    setPending(true);
    try {
      const result = await sendMessage(interlocutor.id, message);
      if (result.ok) {
        setMessage("");

        socket?.emit("messageUpdate", {
          chatId: result.data.chatId,
          messageId: result.data.id,
          authorId: result.data.authorId,
          interlocutorId: interlocutor.id,
          status: "created",
        });

        if (chat?.id !== result.data.chatId) {
          // await refetchChat(interlocutor);
        } else {
          await refetchMessages("smooth");
        }

        await refetchOpenChats();
        generateResponse(result.data.chatId);
      }
    } finally {
      setPending(false);
    }
  };

  const handleInsertEmoji = useInsertEmoji(inputRef, message, setMessage);
  useInputFocus(inputRef);

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
