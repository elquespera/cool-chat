import { createContext, useContext } from "react";

export type ChatWindowPage = "sidebar" | "chat";

type ChatWindowContextType = {
  page: ChatWindowPage;
  setPage: (page: ChatWindowPage) => void;
  isMobile: boolean;
};

export const ChatWindowContext = createContext<ChatWindowContextType>({
  page: "sidebar",
  setPage: () => {},
  isMobile: false,
});

export const useChatWindow = () => useContext(ChatWindowContext);
