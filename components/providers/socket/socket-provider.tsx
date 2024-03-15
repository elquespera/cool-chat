"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IOSocket, SocketContext } from "./socket-context";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<IOSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket: IOSocket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
      addTrailingSlash: false,
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
