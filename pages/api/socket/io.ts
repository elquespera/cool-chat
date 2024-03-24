import { Server as NetServer, Socket } from "net";

import { Server as HttpServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { db } from "@/db/db";
import { settings } from "@/db/schemas/settings";

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  _: NextApiRequest,
  response: NextApiResponseServerIO,
) {
  if (!response.socket.server.io) {
    const httpServer: HttpServer = response.socket.server as any;
    const io = new SocketIOServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {
      path: process.env.NEXT_PUBLIC_SOCKET_IO_URL!,
      addTrailingSlash: false,
      connectionStateRecovery: {},
    });

    io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        const userId = socket.data.userId;
        console.log("user disconnected", userId);
        socket.broadcast.emit("userStatusChange", {
          userId,
          status: "offline",
        });

        updateStatus(userId, "offline");
      });

      socket.on("userStatusChange", ({ userId, status }) => {
        console.log("user status change", userId, status);
        socket.data.userId = userId;
        socket.broadcast.emit("userStatusChange", { userId, status });
        if (status === "offline" || status === "online") {
          updateStatus(userId, status);
        }
      });

      socket.on("messageUpdate", async (args) => {
        socket.broadcast.emit("messageUpdate", args);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
}

async function updateStatus(userId: string, status: "offline" | "online") {
  await db.insert(settings).values({ userId, status }).onConflictDoUpdate({
    target: settings.userId,
    set: { status },
  });
}
