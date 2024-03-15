"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";
import { MessageItem } from "./message-item";

type ChatWindowProps = {};

export function ChatWindow({}: ChatWindowProps) {
  const { interlocutor } = useChat();
  const { messages, scrollBehavior, pending } = useMessages();
  const messageRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: scrollBehavior,
      block: "end",
    });
  }, [messages, scrollBehavior]);

  return (
    <div className="relative grow bg-muted">
      {interlocutor ? (
        messages.length ? (
          <ScrollArea className="inset-0" style={{ position: "absolute" }}>
            <ul
              ref={messageRef}
              className="mx-auto flex max-w-[48rem] flex-col p-4 pt-24"
            >
              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  series={message.authorId === messages[index + 1]?.authorId}
                />
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <ChatEmpty />
        )
      ) : (
        <ChatEmpty />
      )}
    </div>
  );
}

function ChatEmpty() {
  return (
    <div className="flex h-full flex-col justify-center text-center font-medium text-muted-foreground">
      Select a contact to start or continue a conversation.
    </div>
  );
}
