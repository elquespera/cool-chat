export type SocketData = {
  userId: string;
};

export type UserStatus = "online" | "offline" | "typing";

export type UserStatusChange = {
  userId: string;
  status: UserStatus;
};

export type MessageActionType =
  | "created"
  | "updated"
  | "delivered"
  | "read"
  | "deleted";

export type MessageUpdate = {
  messageId: string;
  chatId: string;
  authorId: string;
  interlocutorId: string;
  status: MessageActionType;
};

export type SocketMessageType = { userId: string } & (
  | { type: "userstatuschange"; payload: UserStatusChange }
  | { type: "messageupdate"; payload: MessageUpdate }
);
