import { Socket, Server as NetServer } from "net";

import { NextApiRequest, NextApiResponse } from "next";
import { Server as HttpServer } from "http";
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
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
      httpServer,
      {
        path: process.env.NEXT_PUBLIC_SOCKET_IO_URL!,
        addTrailingSlash: false,
        connectionStateRecovery: {},
      },
    );

    io.on("connection", (socket) => {
      console.log(`Connected to socket ${socket.id}`);

      socket.on("disconnect", (reason) => {
        console.log(
          `Socket ${socket.id} was disconnected because of ${reason}.`,
        );
      });

      socket.on("messageModified", (...args) => {
        socket.broadcast.emit("messageModified", ...args);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
}
