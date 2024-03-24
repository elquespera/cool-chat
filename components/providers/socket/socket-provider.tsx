"use client";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { PropsWithChildren, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth/auth-context";
import { IOSocket, SocketContext } from "./socket-context";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState<IOSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket: IOSocket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
      addTrailingSlash: false,
    });

    socket.on("connect", () => {
      socket.emit("userStatusChange", { userId: user.id, status: "online" });
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      socket.emit("userStatusChange", { userId: user.id, status: "offline" });
      setIsConnected(false);
    });

    socket.on("messageUpdate", (payload) =>
      dispatchCustomEvent("messageupdate", payload),
    );

    socket.on("userStatusChange", (payload) =>
      dispatchCustomEvent("userstatuschange", payload),
    );

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
