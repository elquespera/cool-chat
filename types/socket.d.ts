interface ServerToClientEvents {
  messageModified: (chatId: string, messageId: string) => void;
}

interface ClientToServerEvents {
  messageModified: (chatId: string, messageId: string) => void;
}

interface InterServerEvents {}

interface SocketData {}
