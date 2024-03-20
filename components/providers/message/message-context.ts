import { MessageWithAuthor } from "@/db/schemas/messages";
import { createContext, useContext } from "react";

type MessageContextType = {
  messages?: MessageWithAuthor[];
  isLoading: boolean;
  isValidating: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  refetch: (scrollBehavior?: ScrollBehavior) => Promise<void>;
  fetchNextPage: () => void;
  scrollBehavior?: ScrollBehavior;
  setScrollBehavior: (scrollBehavior?: ScrollBehavior) => void;
};

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  isLoading: false,
  isValidating: false,
  isLoadingMore: false,
  isReachingEnd: false,
  refetch: () => new Promise(() => {}),
  fetchNextPage: () => {},
  setScrollBehavior: () => {},
});

export const useMessages = () => useContext(MessageContext);
