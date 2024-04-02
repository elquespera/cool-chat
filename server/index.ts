import { randomUUID } from "crypto";
import { updateUserStatus } from "./db";
import { socketRoutes } from "./src/socket-routes";
import { SocketData, SocketMessageType, UserStatus } from "./src/socket-types";
import { verifyHMAC } from "./src/verfy-hmac";

const roomName = "cool-chat";

const openTickets: Set<string> = new Set();

const server = Bun.serve<SocketData>({
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === socketRoutes.connect) {
      const userId = url.searchParams.get("userId");
      const ticket = url.searchParams.get("ticket");
      const isAuth = ticket && openTickets.has(ticket);

      if (userId && isAuth) {
        const success = server.upgrade(req, { data: { userId, ticket } });
        if (success) return undefined;
      } else {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
    }

    if (url.pathname === socketRoutes.auth && req.method === "GET") {
      const authorization = req.headers.get("Authorization");

      if (verifyHMAC(authorization, url.pathname, "GET")) {
        const ticket = randomUUID();
        openTickets.add(ticket);
        return new Response(JSON.stringify({ ticket }));
      }

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (url.pathname === socketRoutes.status && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "running", active_users: openTickets.size }),
      );
    }

    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
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
      openTickets.delete(ws.data.ticket);
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
