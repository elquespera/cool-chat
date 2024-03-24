type MessageUpdateListener = (payload: {
  messageId: string;
  chatId: string;
  authorId: string;
  interlocutorId: string;
  status: MessageActionType;
}) => void;

type UserStatus = "online" | "offline" | "typing";
type UserStatusListener = (payload: {
  userId: string;
  status: UserStatus;
}) => void;

type ServerToClientEvents = {
  messageUpdate: MessageUpdateListener;
  userStatusChange: UserStatusListener;
};

type ClientToServerEvents = {
  messageUpdate: MessageUpdateListener;
  userStatusChange: UserStatusListener;
};

type InterServerEvents = {};

type SocketData = {
  userId: string;
};
