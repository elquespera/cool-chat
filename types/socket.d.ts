type MessageModifiedListener = (chatId: string, messageId: string) => void;
type UserStatus = "online" | "offline" | "typing";
type UserStatusListener = (userId: string, status: UserStatus) => void;

type ServerToClientEvents = {
  messageModified: MessageModifiedListener;
  userStatusChange: UserStatusListener;
};

type ClientToServerEvents = {
  messageModified: MessageModifiedListener;
  userStatusChange: UserStatusListener;
};

type InterServerEvents = {};

type SocketData = {
  userId: string;
};
