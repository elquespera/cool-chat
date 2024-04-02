"use client";
import { dispatchCustomEvent } from "@/lib/custom-event";
import type {
  MessageUpdate,
  SocketMessageType,
  UserStatus,
} from "@/server/socket-types";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { SocketContext } from "./socket-context";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  const updateUserStatus = (status: UserStatus) => {
    if (!user || !wsRef.current) return;
    const message: SocketMessageType = {
      userId: user.id,
      type: "userstatuschange",
      payload: {
        userId: user.id,
        status,
      },
    };
    wsRef.current.send(JSON.stringify(message));
  };

  const updateMessageStatus = (payload: MessageUpdate) => {
    if (!user || !wsRef.current) return;
    const message: SocketMessageType = {
      userId: user.id,
      type: "messageupdate",
      payload,
    };
    wsRef.current.send(JSON.stringify(message));
  };

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:3334/ws?userId=${user.id}`);
    wsRef.current = ws;

    ws.addEventListener("open", async () => {
      setIsConnected(true);
    });

    ws.addEventListener("close", async () => {
      setIsConnected(false);
    });

    ws.addEventListener("message", async (event: MessageEvent<string>) => {
      try {
        const parsed: SocketMessageType = JSON.parse(event.data);
        const { type, userId, payload } = parsed;
        if (userId === user.id) return;

        dispatchCustomEvent(type, payload);
      } catch (e) {
        console.error(e);
      }
    });

    return () => ws.close();
  }, [user]);

  return (
    <SocketContext.Provider
      value={{ isConnected, updateUserStatus, updateMessageStatus }}
    >
      {children}
    </SocketContext.Provider>
  );
};
