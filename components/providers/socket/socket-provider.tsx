"use client";
import { dispatchCustomEvent } from "@/lib/custom-event";
import type {
  MessageUpdate,
  SocketMessageType,
  UserStatus,
} from "@/server/src/socket-types";

import { socketRoutes } from "@/server/src/socket-routes";
import { User } from "lucia";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SocketContext } from "./socket-context";

const baseWsURL = `${process.env.NEXT_PUBLIC_WS_URL}${socketRoutes.connect}`;
const wsDelay = 1000;

type SocketProviderProps = {
  user: User | null;
  ticket: string | null;
} & PropsWithChildren;

export const SocketProvider = ({
  user,
  ticket,
  children,
}: SocketProviderProps) => {
  const [wsURL, setWsURL] = useState<string | null>(null);

  const { readyState, lastJsonMessage, sendJsonMessage } =
    useWebSocket<SocketMessageType>(wsURL, {
      shouldReconnect: () => true,
      reconnectAttempts: process.env.NODE_ENV === "production" ? 20 : 2,
      reconnectInterval: 3000,
    });

  useEffect(() => {
    if (!lastJsonMessage || !user) return;

    try {
      const { type, userId, payload } = lastJsonMessage;
      if (userId === user.id) return;
      dispatchCustomEvent(type, payload);
    } catch {}
  }, [lastJsonMessage, user]);

  useEffect(() => {
    const timer =
      user && ticket
        ? setTimeout(
            () => setWsURL(`${baseWsURL}?userId=${user?.id}&ticket=${ticket}`),
            wsDelay,
          )
        : setTimeout(() => setWsURL(null));

    return () => clearTimeout(timer);
  }, [user, ticket]);

  const value = useMemo(
    () => ({
      isConnected: readyState === ReadyState.OPEN,

      updateUserStatus: (status: UserStatus, interlocutorId?: string) => {
        if (!user) return;
        sendJsonMessage({
          userId: user.id,
          type: "userstatuschange",
          payload: {
            userId: user.id,
            interlocutorId,
            status,
          },
        });
      },

      updateMessageStatus: (payload: MessageUpdate) => {
        if (!user) return;

        sendJsonMessage({
          type: "messageupdate",
          userId: user.id,
          payload,
        });
      },
    }),

    [user, readyState, sendJsonMessage],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
