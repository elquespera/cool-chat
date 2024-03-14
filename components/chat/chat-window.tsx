"use client";
import { useChat } from "../providers/chat/chat-context";
import { ScrollArea } from "../ui/scroll-area";

export function ChatWindow() {
  const { interlocutor } = useChat();

  return (
    <div className="relative grow bg-muted">
      {interlocutor ? (
        <ScrollArea className="inset-0" style={{ position: "absolute" }}>
          <ul className="p-4 pt-24"></ul>
        </ScrollArea>
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
