import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect, OpenChat } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type OpenChatsContextType = {
  openChats?: OpenChat[];
  refetchOpenChats: () => Promise<OpenChat[] | void | undefined>;

  selectedChat: ChatSelect | null;
  setSelectedChat: (chat: ChatSelect | null) => void;

  selectedContact?: ContactUser;
  setSelectedContact: (contact?: ContactUser) => void;
};

export const OpenChatsContext = createContext<OpenChatsContextType>({
  refetchOpenChats: () => Promise.resolve(),
  selectedChat: null,
  setSelectedChat: () => {},
  setSelectedContact: () => {},
});

export const useOpenChats = () => useContext(OpenChatsContext);
