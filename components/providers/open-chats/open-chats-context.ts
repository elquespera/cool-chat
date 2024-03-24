import { OpenChat } from "@/db/schemas/chats";
import { createContext, useContext } from "react";

type OpenChatsContextType = {
  openChats?: OpenChat[];
  refetchOpenChats: () => Promise<OpenChat[] | void | undefined>;
};

export const OpenChatsContext = createContext<OpenChatsContextType>({
  refetchOpenChats: () => Promise.resolve(),
});

export const useOpenChats = () => useContext(OpenChatsContext);
