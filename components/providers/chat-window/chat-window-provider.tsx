"use client";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import {
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import { ChatWindowContext, ChatWindowPage } from "./chat-window-context";
import { useRouter } from "next/navigation";
import { wait } from "@/lib/utils";

const chatRoutes = [routes.chat, routes.user, routes.assistant];

export function ChatWindowProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [page, setPage] = useState<ChatWindowPage>("sidebar");
  const [isLoading, startTransition] = useTransition();

  const value = useMemo(
    () => ({
      page,
      isMobile,
      isLoading,
      navigate: async (path: string) => {
        setTimeout(() => setPage(checkRoute(path)), 0);
        startTransition(() => {
          router.push(path);
        });
      },
    }),
    [isMobile, page, router, isLoading],
  );

  useLayoutEffect(() => {
    setPage(checkRoute(pathname));
  }, [pathname]);

  return (
    <ChatWindowContext.Provider value={value}>
      {children}
    </ChatWindowContext.Provider>
  );
}

const checkRoute = (pathname: string | null) =>
  chatRoutes.some((route) => pathname?.startsWith(route)) ? "chat" : "sidebar";
