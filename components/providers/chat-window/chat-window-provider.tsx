"use client";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ChatWindowContext } from "./chat-window-context";

export function ChatWindowProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 639px)");

  const value = useMemo(
    () =>
      ({
        page:
          pathname?.startsWith(routes.chat) || pathname?.startsWith(routes.user)
            ? "chat"
            : "sidebar",
        isMobile,
      }) as const,
    [isMobile, pathname],
  );

  return (
    <ChatWindowContext.Provider value={value}>
      {children}
    </ChatWindowContext.Provider>
  );
}
