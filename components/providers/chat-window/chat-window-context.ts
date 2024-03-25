import { createContext, useContext } from "react";

export type ChatWindowPage = "sidebar" | "chat";

type ChatWindowContextType = {
  page: ChatWindowPage;
  isMobile: boolean;
};

export const ChatWindowContext = createContext<ChatWindowContextType>({
  page: "sidebar",
  isMobile: false,
});

export const useChatWindow = () => useContext(ChatWindowContext);
