"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "../providers/socket/socket-context";

export const SocketIndicator = ({ className }: PropsWithClassName) => {
  const { isConnected } = useSocket();

  return (
    <div
      className={cn(
        "w-2 aspect-square rounded-full",
        isConnected ? "bg-emerald-500" : "bg-gray-500 animate-pulse",
        className
      )}
    />
  );
};
