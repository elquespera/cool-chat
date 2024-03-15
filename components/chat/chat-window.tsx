"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user/user-avatar";
import { cn } from "@/lib/utils";
import { useMessages } from "../providers/message/message-context";

type ChatWindowProps = {};

export function ChatWindow({}: ChatWindowProps) {
  const { interlocutor } = useChat();
  const { messages, pending } = useMessages();

  return (
    <div className="relative grow bg-muted">
      {interlocutor ? (
        messages.length ? (
          <ScrollArea className="inset-0" style={{ position: "absolute" }}>
            <ul className="mx-auto flex max-w-[48rem] flex-col gap-4 p-4 pt-24">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
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

type MessageProps = { message: MessageWithAuthor };

function Message({ message: { content, author, createdAt } }: MessageProps) {
  const { user } = useAuth();
  const ownMessage = user?.id === author.id;

  return (
    <li
      className={cn("flex items-end gap-2", ownMessage && "flex-row-reverse")}
    >
      <UserAvatar avatarUrl={author.avatarUrl} />
      <div className="flex max-w-[24rem] grow flex-col rounded-md border bg-background p-4">
        <p>{content}</p>
        <p className="self-end text-sm text-muted-foreground">
          {createdAt.toLocaleTimeString()}
        </p>
      </div>
    </li>
  );
}

function ChatEmpty() {
  return (
    <div className="flex h-full flex-col justify-center text-center font-medium text-muted-foreground">
      Select a contact to start or continue a conversation.
    </div>
  );
}
