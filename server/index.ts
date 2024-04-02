import { updateUserStatus } from "./db";
import { SocketData, SocketMessageType, UserStatus } from "./socket-types";

const roomName = "cool-chat";

const server = Bun.serve<SocketData>({
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const userId = url.searchParams.get("userId");
      if (userId) {
        const success = server.upgrade(req, { data: { userId } });
        if (success) return undefined;
      }
    }

    return new Response(JSON.stringify({ status: "running" }));
  },

  websocket: {
    open: async (ws) => {
      ws.subscribe(roomName);
      await publishUserStatus(ws.data.userId, "online");
      console.log(`Connection open wtih ${ws.data.userId}`);
    },
    message(_, message) {
      server.publish(roomName, message);
      console.log(message);
    },
    close: async (ws) => {
      console.log(`Connection closed with ${ws.data.userId}`);
      await publishUserStatus(ws.data.userId, "offline");
      ws.unsubscribe(roomName);
    },
  },
  port: process.env.PORT || 3000,
});

const publishUserStatus = async (userId: string, status: UserStatus) => {
  await updateUserStatus(userId, status);

  const message: SocketMessageType = {
    userId,
    type: "userstatuschange",
    payload: {
      userId,
      status,
    },
  };
  server.publish(roomName, JSON.stringify(message));
};

console.log(`Listening on ${server.hostname}:${server.port}`);
