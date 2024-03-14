"use client";
import { PropsWithChildren, useState } from "react";
import { ChatContext } from "./chat-context";
import type { ContactUser } from "@/db/schemas/auth";

export function ChatProvider({ children }: PropsWithChildren) {
  const [interlocutor, setIntercolutor] = useState<ContactUser | null>(null);

  return (
    <ChatContext.Provider value={{ interlocutor, setIntercolutor }}>
      {children}
    </ChatContext.Provider>
  );
}
