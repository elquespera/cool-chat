"use client";
import { sendMessage } from "@/db/actions/messages";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { FormEventHandler, useRef, useState } from "react";
import { IconButton } from "../common/icon-button";
import { MultiTextArea } from "../common/multi-textarea";
import { useAssistant } from "../providers/assistant/assistant-context";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { useContacts } from "../providers/contacts/contact-context";
import { useMessages } from "../providers/message/message-context";
import { useSocket } from "../providers/socket/socket-context";
import { EmojiPicker } from "./emoji-picker";
import { useInputFocus } from "./use-input-focus";
import { useInsertEmoji } from "./use-insert-emoji";
import { InputWrapper } from "../common/input-wrapper";
import { GlassPanel } from "../common/glass-panel";

export function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { interlocutor, chat, refetchChat } = useChat();
  const { isStreaming, generateResponse } = useAssistant();
  const { refetchMessages } = useMessages();
  const { refetchContacts } = useContacts();

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
          await refetchChat(interlocutor);
          await refetchContacts();
        } else {
          await refetchMessages("smooth");
        }

        generateResponse(result.data.chatId);
      }
    } finally {
      setPending(false);
    }
  };

  const handleInsertEmoji = useInsertEmoji(inputRef, message, setMessage);
  useInputFocus(inputRef);

  return interlocutor ? (
    <GlassPanel position="bottom">
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
            variant="ghost"
            className="h-8 w-8 group-focus-within:text-primary dark:group-focus-within:text-foreground"
            type="submit"
            disabled={!isValid}
            icon={<PaperPlaneIcon />}
          />
        </InputWrapper>
      </form>
    </GlassPanel>
  ) : null;
}
