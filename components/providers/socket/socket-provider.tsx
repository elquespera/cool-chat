"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import { SocketContext } from "./socket-context";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => setIsConnected(false));

    setSocket(socket);

    return () => socketInstance.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
