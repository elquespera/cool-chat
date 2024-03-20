"use client";
import { ReactNode, useEffect, useRef } from "react";
import { Spinner } from "../common/spinner";
import { MessageItem } from "../message/message-item";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { ScrollArea } from "../ui/scroll-area";

export function ChatWindow() {
  const { interlocutor } = useChat();
  const { messages, chatScroll } = useMessages();
  const messageRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (chatScroll === "none") return;

    messageRef.current?.scrollIntoView({
      behavior: chatScroll === "smooth" ? "smooth" : "instant",
      block: "end",
    });
  }, [messages, chatScroll]);

  return (
    <div className="relative grow bg-muted">
      {interlocutor ? (
        messages?.length ? (
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
          <ChatEmpty
            message={
              <p>
                Type something and press &apos;Enter&apos; to send your first
                message.
                <br /> Use &apos;Shift+Enter&apos; for a new line.
              </p>
            }
          />
        )
      ) : (
        <ChatEmpty
          message={
            <p>
              Select a contact to start or continue a conversation.
              <br />
              Use search input to find new users.
            </p>
          }
        />
      )}
    </div>
  );
}

function ChatEmpty({ message }: { message: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center p-4 text-center text-sm font-medium text-muted-foreground">
      {message}
    </div>
  );
}
