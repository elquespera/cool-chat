import { Server as NetServer, Socket } from "net";

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
      socket.broadcast.emit("userStatusChange", socket.data.userId, "online");

      socket.on("disconnect", () => {
        socket.broadcast.emit(
          "userStatusChange",
          socket.data.userId,
          "offline",
        );
      });

      socket.on("userStatusChange", (...args) => {
        socket.broadcast.emit("userStatusChange", ...args);
      });

      socket.on("messageUpdate", async (args) => {
        socket.broadcast.emit("messageUpdate", args);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
}
