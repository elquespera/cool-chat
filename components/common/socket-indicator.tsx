"use client";

import { ComponentProps } from "react";
import { useSocket } from "../providers/socket/socket-context";
import { StatusIndicator } from "./status-indicator";

type SocketIndicatorProps = Omit<
  ComponentProps<typeof StatusIndicator>,
  "status"
>;

export const SocketIndicator = (props: SocketIndicatorProps) => {
  const { isConnected } = useSocket();

  return (
    <StatusIndicator status={isConnected ? "online" : "pending"} {...props} />
  );
};
