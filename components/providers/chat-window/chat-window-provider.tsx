"use client";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ChatWindowContext } from "./chat-window-context";

const chatRoutes = [routes.chat, routes.user, routes.assistant];

export function ChatWindowProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 639px)");

  const value = useMemo(
    () =>
      ({
        page: chatRoutes.some((route) => pathname?.startsWith(route))
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
