import { Server as NetServer, Socket } from "net";

import { db } from "@/db/db";
import { users } from "@/db/schemas/auth";
import { eq } from "drizzle-orm";
import { Server as HttpServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

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
        socket.broadcast.emit("userStatusChange", {
          userId,
          status: "offline",
        });

        updateUserStatus(userId, "offline");
      });

      socket.on("userStatusChange", ({ userId, status }) => {
        socket.data.userId = userId;
        socket.broadcast.emit("userStatusChange", { userId, status });

        updateUserStatus(userId, status);
      });

      socket.on("messageUpdate", async (args) => {
        socket.broadcast.emit("messageUpdate", args);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
}

async function updateUserStatus(userId: string, status: UserStatus) {
  console.log(`User status: ${userId} => ${status}`);
  await db
    .update(users)
    .set({ status: status === "offline" ? "offline" : "online" })
    .where(eq(users.id, userId));
}
