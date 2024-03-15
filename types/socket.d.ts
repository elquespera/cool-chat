type MessageModifiedListener = (chatId: string, messageId: string) => void;

type ServerToClientEvents = {
  messageModified: MessageModifiedListener;
};

type ClientToServerEvents = {
  messageModified: MessageModifiedListener;
};

type InterServerEvents = {};

type SocketData = {};
