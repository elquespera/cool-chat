import { MessageUpdate, UserStatus } from "@/server/src/socket-types";
import { createContext, useContext } from "react";

type SocketContextType = {
  isConnected: boolean;
  updateUserStatus: (status: UserStatus) => void;
  updateMessageStatus: (payload: MessageUpdate) => void;
};

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  updateUserStatus: () => {},
  updateMessageStatus: () => {},
});

export const useSocket = () => useContext(SocketContext);
