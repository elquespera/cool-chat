"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "../providers/socket/socket-context";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full",
        isConnected ? "bg-emerald-500" : "bg-gray-500 animate-pulse"
      )}
    />
  );
};
