import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export type IOSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketContextType = {
  socket: IOSocket | null;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
