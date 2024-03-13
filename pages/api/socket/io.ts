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
  response: NextApiResponseServerIO
) {
  if (!response.socket.server.io) {
    const httpServer: HttpServer = response.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: process.env.NEXT_PUBLIC_SOCKET_IO_URL!,
      addTrailingSlash: false,
    });

    response.socket.server.io = io;
  }

  response.end();
}
