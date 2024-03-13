"use client";

import { useSocket } from "../providers/socket/socket-context";

export const SocketIndicator = () => {
  const { isConnected, socket } = useSocket();

  // socket.on()

  return (
    <div
      className={`w-2 h-2 rounded-full ${
        isConnected ? "bg-emerald-500" : "bg-gray-500 animate-pulse"
      }`}
    />
  );
};
