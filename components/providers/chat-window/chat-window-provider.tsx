"use client";
import { PropsWithChildren, useMemo, useState } from "react";
import { ChatWindowContext, ChatWindowPage } from "./chat-window-context";
import { useMediaQuery } from "usehooks-ts";

export function ChatWindowProvider({ children }: PropsWithChildren) {
  const [page, setPage] = useState<ChatWindowPage>("sidebar");
  const isMobile = useMediaQuery("(max-width: 639px)");

  const value = useMemo(
    () => ({ page, setPage, isMobile }),
    [page, setPage, isMobile],
  );

  return (
    <ChatWindowContext.Provider value={value}>
      {children}
    </ChatWindowContext.Provider>
  );
}
