import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type MessageContextType = {
  messages?: MessageWithAuthor[];
  isLoading: boolean;
  isValidating: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  refetchMessages: (scrollBehavior?: ScrollBehavior) => Promise<void>;
  fetchNextPage: () => void;
  scrollBehavior?: ScrollBehavior;
  setScrollBehavior: (scrollBehavior?: ScrollBehavior) => void;
  editingId?: string;
  setEditingId: (id?: string) => void;
};

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  isLoading: false,
  isValidating: false,
  isLoadingMore: false,
  isReachingEnd: false,
  refetchMessages: () => new Promise(() => {}),
  fetchNextPage: () => {},
  setScrollBehavior: () => {},
  setEditingId: () => {},
});

export const useMessages = () => useContext(MessageContext);
