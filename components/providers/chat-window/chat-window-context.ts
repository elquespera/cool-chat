import { createContext, useContext } from "react";

export type ChatWindowPage = "sidebar" | "chat";

type ChatWindowContextType = {
  page: ChatWindowPage;
  isMobile: boolean;
  isLoading: boolean;
  navigate: (path: string) => void;
};

export const ChatWindowContext = createContext<ChatWindowContextType>({
  page: "sidebar",
  isMobile: false,
  isLoading: false,
  navigate: () => {},
});

export const useChatWindow = () => useContext(ChatWindowContext);
